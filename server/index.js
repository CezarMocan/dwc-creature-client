import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import ioModule from 'socket.io'
import httpModule from 'http'
import { manager as DistributedManager } from './distributedManager'
import { setGarden, getGardenConfig, getOtherGardens, PERFORMANCE_PHASES, getPerformancePhase, setPerformancePhase } from './config'
import { isPerformancePhaseCentralized, isPerformancePhaseDecentralized, isPerformancePhaseDistributed } from './config'
import { logError, logSuccess } from './log'

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
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  var http = httpModule.Server(server)
  var io = ioModule(http)
  var port = GARDEN_CONFIG.port || 3010;

  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

  server.get('*', (req, res, next) => {
    console.log('Request: ', req.originalUrl)
    if (req.originalUrl.indexOf('/noclients') == 0) return next()
    if (req.originalUrl.indexOf('/hello') == 0) return next()
    if (req.originalUrl.indexOf('/goodbye') == 0) return next()
    if (req.originalUrl.indexOf('/performance') == 0) return next()
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
    DistributedManager.broadcastCentralizedStart()
    logSuccess('Success!', req, res)
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
  server.get('/noclients', (req, res, next) => {
    const noClients = DistributedManager.noClients
    res.send({ noClients })
  })
  
})
