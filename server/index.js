import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import ioModule from 'socket.io'
import httpModule from 'http'
import compression from 'compression'
import { manager as DistributedManager } from './distributedManager'
import { GARDENS, CREATURES, setGarden, getGardenConfig, getOtherGardens, PERFORMANCE_PHASES, getPerformancePhase, setPerformancePhase } from './config'
import { isPerformancePhaseCentralized, isPerformancePhaseDecentralized, isPerformancePhaseDistributed } from './config'
import { centralizedPhaseStartPlay } from './config'
import { logError, logSuccess } from './log'

if (Object.keys(GARDENS).indexOf(process.argv[2].toLowerCase()) == -1) {
  console.error('Could not start server. Garden must be one of: ')
  console.dir(Object.keys(GARDENS))
  process.exit(0)
}

setGarden(process.argv[2])
setPerformancePhase(PERFORMANCE_PHASES.CENTRALIZED)

const GARDEN_CONFIG = getGardenConfig()
const OTHER_GARDENS = getOtherGardens()

console.log('Starting garden: ', GARDEN_CONFIG.name)
console.dir(GARDEN_CONFIG)
console.log('The other gardens are: ')
console.dir(OTHER_GARDENS)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(compression())
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  var http = httpModule.Server(server)
  var io = ioModule(http)
  var port = GARDEN_CONFIG.port || 3010;

  if (process.env.NODE_ENV === "production") {
    server.get(
      /^\/_next\/static\/images\//,
      (_, res, nextHandler) => {
        res.setHeader(
          "Cache-Control",
          "public, max-age=31536000, immutable",
        );
        nextHandler();
      },
    );
  }

  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

  server.get('*', (req, res, next) => {
    console.log('Request: ', req.originalUrl)
    if (req.originalUrl.indexOf('/stats') == 0) return next()
    if (req.originalUrl.indexOf('/hello') == 0) return next()
    if (req.originalUrl.indexOf('/goodbye') == 0) return next()
    if (req.originalUrl.indexOf('/changePhase') == 0) return next()
    if (req.originalUrl.indexOf('/centralized/start') == 0) return next()
    if (req.originalUrl.indexOf('/static/images') != -1) {
      // console.log('Getting image')
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );
    }
    return handle(req, res)
  })

  http.listen(port, function(){
    console.log('listening on *:', port)
  })

  // A client connected to the garden
  io.on('connection', (socket) => {
    // if (isPerformancePhaseDistributed())
      DistributedManager.addClient(socket)
  })

  // Set current performance phase
  // curl -d 'phase=centralized' http://localhost:3001/changePhase
  // curl -d 'phase=decentralized' http://localhost:3001/changePhase
  // curl -d 'phase=distributed' http://localhost:3001/changePhase
  server.post('/changePhase', (req, res, next) => {
    const phaseName = (req.body.phase).toUpperCase()

    if (!phaseName) {
      logError('Warning: The request does not have a "phase" parameter', req, res)
      return
    }

    if (!PERFORMANCE_PHASES[phaseName]) {
      logError('Warning: The performance phase you sent in the parameter does not exist. It should be one of CENTRALIZED, DECENTRALIZED, DISTRIBUTED', req, res)
      return
    }

    setPerformancePhase(PERFORMANCE_PHASES[phaseName])
    DistributedManager.broadcastGardenInfo()

    logSuccess(`Performance is now in phase ${phaseName}`, req, res)
  })

  // Start animation for centralized phase of performance
  // curl -d '' http://localhost:3001/centralized/start
  server.post('/centralized/start', (req, res) => {
    if (!isPerformancePhaseCentralized()) {
      logError('Performance phase is not centralized! Doing nothing.', req, res)
      return
    }
    centralizedPhaseStartPlay()
    DistributedManager.broadcastCentralizedStart()
    logSuccess('Centralized Phase: Creature birth animation starting', req, res)
  })

  // Creature entering the garden
  // curl -d 'creature=2' http://localhost:3001/hello
  server.post('/hello', (req, res, next) => {
    const creatureId = req.body.creature

    if (isPerformancePhaseCentralized()) {
      logError('Can not acquire creature in centralized phase of performance', req, res)
      return
    }

    if (!creatureId) {
      logError('Warning: The request does not have a "creature" parameter', req, res)
      return
    }

    if (!CREATURES[creatureId]) {
      const creatureNames = Object.keys(CREATURES).reduce((acc, name) => {
        return acc + ' ' + name
      }, '')
      logError('Warning: The request does not have a "creature" parameter. Creature must be one of ' + creatureNames, req, res)
      return
    }

    DistributedManager.helloCreature(creatureId)

    logSuccess('Creature ' + creatureId + ' has successfully entered the garden', req, res)
  })

  // Creature leaving the garden
  // curl -d 'creature=2' http://localhost:3001/goodbye
  server.post('/goodbye', (req, res, next) => {
    const creatureId = req.body.creature

    if (isPerformancePhaseCentralized()) {
      logError('Can not have creature leave in centralized phase of performance', req, res)
      return
    }

    if (!creatureId) {
      logError('Warning: The request does not have a "creature" parameter', req, res)
      return
    }

    DistributedManager.goodbyeCreature(creatureId)

    logSuccess('Creature ' + creatureId + ' has successfully left the garden', req, res)
  })

  // Debug endpoint for getting the number of connected clients
  server.get('/stats', (req, res, next) => {
    const stats = DistributedManager.stats
    res.send(stats)
  })

})
