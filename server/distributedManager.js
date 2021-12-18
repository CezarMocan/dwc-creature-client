import network from './network'
import { getGardenName, getOtherGardenAddress, getPerformancePhase, CREATURES } from "./config"
import Client from './Client'

// var ooled = require('../utils/oled');

class Manager {
  constructor() {
    this.clients = {}
    this.creatures = {}
    this.creaturesPerClient = {}

    this.removeClient = this.removeClient.bind(this)
    this.onClientCreatureExit = this.onClientCreatureExit.bind(this)
  }

  get stats() {
    return {
      'Garden: ': getGardenName(),
      'Number of connected clients: ': this.noClients,
      'Creatures in this garden: ': Object.keys(this.creatures),
      'Performance phase': getPerformancePhase()
    }
  }

  get noClients() {
    return Object.keys(this.clients).length
  }

  addClient(socket) {
    const client = new Client({
      id: socket.id,
      socket: socket,
      onDisconnect: this.removeClient,
      onCreatureExit: this.onClientCreatureExit,
      manager: this
    })

    this.clients[socket.id] = client

    // If this is the first client in current session, send all active creatures over to them.
    if (this.noClients == 1) {
      Object.keys(this.creatures).forEach((creatureId) => {
        setTimeout(() => {
          let canMove = true
          Object.values(this.clients).forEach(c => {
            if (c.creatureOwnership[creatureId]) canMove = false
          })
          if (canMove) this.moveCreatureToNewClient(creatureId)
        }, Math.random() * 7000)
      })
    } else {
      // Add new creature for each incoming client
      setTimeout(() => {
        const creatureIndex = Math.floor((Math.random() * 19) + 3) - 1
        const creatureId = Object.keys(CREATURES)[creatureIndex]
        this.creaturesPerClient[socket.id] = creatureId
        this.helloCreature(creatureId)  
      }, 500)
    }

    console.log('Connected: ', socket.id, this.noClients)
//	ooled.print('Connected: ' + socket.id + ' ' + this.noClients);
  }

  broadcastGardenInfo() {
    Object.values(this.clients).forEach(client => client.emitGardenInfo())
  }

  broadcastCentralizedStart() {
    Object.values(this.clients).forEach(client => client.emitCentralizedStart())
  }

  removeClient(id) {
    this.goodbyeCreature(this.creaturesPerClient[id])
    delete this.creaturesPerClient[id]
    delete this.clients[id]
    console.log('disconnected: ', id, this.noClients)
//	ooled.print('disconnected: ' + id + ' ' + this.noClients);
  }

  moveCreatureToNewClient(creatureId, prevId) {
    // If the creature has already left the garden, do nothing
    console.log('move creature to new client: ', creatureId, prevId)
    if (!this.isCreaturePresent(creatureId)) return
    console.log('---is creature present: true ')

    let canMove = true
    Object.values(this.clients).forEach(c => {
      if (c.creatureOwnership[creatureId]) canMove = false
    })
    if (!canMove) return
    console.log('---no duplicates')

    // Get all clients
    const clientsAll = Object.values(this.clients)

    // If no clients are connected, do nothing
    if (!clientsAll.length) return
    console.log('---enough clients')

    // Filter down to clients who are active (sent a heartbeat recently)
    const clientsActive = clientsAll.filter((client) => client.isActive)

    // Filter down to all clients except for the previous one, is possible
    const clients = clientsActive.length <= 1 ? clientsActive : clientsActive.filter((client) => client.id != prevId)

    // Find the minimum number of times the creature has visited a client
    const minOwned = clients.reduce((acc, client) => Math.min(acc, client.allCreaturesTotalCount), 100000)

    // Get all clients who've been visited least by the creature
    const candidates = clients.filter((client) => (client.allCreaturesTotalCount == minOwned))
    console.log('---candidates: ', candidates.length)

    // Select the next client at random
    const nextClient = candidates[parseInt(Math.floor(Math.random() * candidates.length))]
    console.log('next client: ', !!nextClient)

    // Pass creature to next client
    if (nextClient) nextClient.acquireCreature(creatureId)
    else setTimeout(() => { this.moveCreatureToNewClient(creatureId, prevId) }, 1000)
  }

  onClientCreatureExit(creatureId, clientId, nextGarden = getGardenName()) {
    console.log('Creature exited: ', creatureId, clientId)
//	ooled.print('Creature exited : ' + creatureId + ' ' + clientId);
    if (nextGarden == getGardenName()) {
      console.log('Creature staying in the same garden')
//	  ooled.print('Creature staying in the same garden');
      this.moveCreatureToNewClient(creatureId, clientId)
    } else {
      console.log('Creature moving to garden: ', nextGarden)
//	  ooled.print('Creature moving to garden: ' + nextGarden)
      this.moveCreatureToNewGarden(creatureId, nextGarden)
    }
  }

  helloCreature(creatureId) {
    if (this.creatures[creatureId]) {
      console.warn('Creature ' + creatureId + ' is already in this garden.\nNo action taken\n\n')
      return
    }

    this.creatures[creatureId] = {
      helloTimestamp: Date.now()
    }

    this.moveCreatureToNewClient(creatureId, -1)
  }

  goodbyeCreature(creatureId) {
    if (!this.isCreaturePresent(creatureId)) return
    const creatureData = this.creatures[creatureId]
    delete this.creatures[creatureId]
  }

  isCreaturePresent(creatureId) {
    return !!this.creatures[creatureId]
  }

  async moveCreatureToNewGarden(creatureId, newGarden) {
    this.goodbyeCreature(creatureId)
    let attempt
    try {
      attempt = await network.sendCreatureToGarden(newGarden, creatureId)
    } catch (e) {
      console.log('Promise rejected!')
      this.helloCreature(creatureId)
    }
  }
}

export const manager = new Manager()
