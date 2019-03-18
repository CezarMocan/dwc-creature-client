import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import ioModule from 'socket.io'
import httpModule from 'http'
import { manager } from './manager'
import { setGarden, getGardenConfig, getOtherGardens } from './config'

setGarden(process.argv[2])

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

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  http.listen(port, function(){
    console.log('listening on *:', port)
  })

  // A client connected to the garden
  io.on('connection', (socket) => {
    manager.addClient(socket)
  })

  // Debug endpoint for getting the number of connected clients
  server.get('/noclients', (req, res, next) => {
    const noClients = manager.noClients
    res.send({ noClients })
  })

  // Creature entering the garden
  // curl -d 'creature=2' http://localhost:3001/hello
  server.post('/hello', (req, res, next) => {
    const creatureId = req.body.creature

    if (!creatureId) {
      const msg = 'Warning: The request does not have a "creature" parameter'    
      console.warn(msg)
      console.dir(req.body)
      res.send(msg)
      return
    }

    manager.helloCreature(creatureId)

    const msg = 'Creature ' + creatureId + ' has successfully entered the garden'
    console.log(msg)
    res.send(msg)
  })

  // Creature leaving the garden
  // curl -d 'creature=2' http://localhost:3001/goodbye
  server.post('/goodbye', (req, res, next) => {
    const creatureId = req.body.creature

    if (!creatureId) {
      const msg = 'Warning: The request does not have a "creature" parameter'
      console.warn(msg)
      res.send(msg)
      return    
    }

    manager.goodbyeCreature(creatureId)
    
    const msg = 'Creature ' + creatureId + ' has successfully left the garden'
    console.log(msg)
    res.send(msg)
  })

})
