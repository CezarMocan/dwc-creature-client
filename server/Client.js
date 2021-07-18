import { CREATURE_FORCE_MOVE_MS, CLIENT_HEARTBEAT_INACTIVE_THRESHOLD, getGardenConfig, getOtherGardens, getPerformancePhase } from "./config"
import { getCentralizedPhaseInfo } from './config'
// var ooled = require('../utils/oled');

export default class Client {
  constructor({ id, socket, onDisconnect, onCreatureExit, manager }) {
    this.id = id
    this.socket = socket
    console.log('Client IP: ', this.socket.handshake.address)
//	ooled.print('Client IP: ' ,  + this.socket.handshake.address);
    this.onDisconnect = onDisconnect
    this.onCreatureExit = onCreatureExit

    this.creatureTotalCount = {}
    this.creatureOwnership = {}

    this.heartbeatTimestamp = Date.now()
    this.manager = manager

    this.socketSetup()
  }

  socketSetup() {
    this.emitGardenInfo()

    this.socket.on('creatureExit', ({ creatureId, nextGarden }) => {
      this.releaseCreature(creatureId, nextGarden)
    })

    this.socket.on('disconnect', () => {
      this.releaseAllCreatures()
      this.onDisconnect(this.id)
    })

    this.socket.on('heartbeat', () => {
      this.heartbeatTimestamp = Date.now()
    })
  }

  emitGardenInfo() {
    if (!this.socket) return
    const centralizedInfo = getCentralizedPhaseInfo()
    this.socket.emit('gardenInfo', {
      localGarden: getGardenConfig(),
      remoteGardens: getOtherGardens(),
      performancePhase: getPerformancePhase(),
      centralizedPhaseData: {
        isPlaying: centralizedInfo.isPlaying,
        timeOffsetMs: centralizedInfo.isPlaying ? (Date.now() - centralizedInfo.playStartTime) : 0
      }
    })
  }

  emitCentralizedStart() {
    if (!this.socket) return
    this.socket.emit('centralizedPhaseStartAnimation')
  }

  get isActive() {
    return (Date.now() - this.heartbeatTimestamp) < CLIENT_HEARTBEAT_INACTIVE_THRESHOLD
  }

  hasCreature(creatureId) {
    return !!this.creatureOwnership[creatureId]
  }

  increaseCreatureTotalCount(creatureId) {
    if (!this.creatureTotalCount[creatureId])
      this.creatureTotalCount[creatureId] = 1
  }

  getCreatureTotalCount(creatureId) {
    return this.creatureTotalCount[creatureId] || 0
  }

  get allCreaturesTotalCount() {
    return Object.values(this.creatureTotalCount).reduce((acc, obj) => {
      return acc + (obj || 0)
    }, 0)
  }

  acquireCreature(creatureId) {
    console.log('acquireCreature: ', creatureId, this.id)
//	ooled.print('acquireCreature: ' + creatureId + ' ' + this.id);
    this.increaseCreatureTotalCount(creatureId)
    this.creatureOwnership[creatureId] = true
    this.socket.emit('acquireCreature', { creatureId })

    // Force release the creature if the client is inactive for a while
    const currCreatureCount = this.getCreatureTotalCount(creatureId)

    setTimeout(() => {
      if (this.hasCreature(creatureId) &&
          this.getCreatureTotalCount(creatureId) == currCreatureCount &&
          !this.isActive)
      {
        console.log('Client ', this.id, ' force releasing creature ', creatureId)
//		ooled.print('Client ' + this.id + ' force releasing creature ' + creatureId);
        this.releaseCreature(creatureId)
      }

    }, CREATURE_FORCE_MOVE_MS)

  }

  releaseCreature(creatureId, nextGarden) {
    if (!this.hasCreature(creatureId)) return
    delete this.creatureOwnership[creatureId]
    delete this.creatureTotalCount[creatureId]
    this.onCreatureExit(creatureId, this.id, nextGarden)
  }

  releaseAllCreatures() {
    Object.keys(this.creatureOwnership).forEach(creatureId => {
      this.releaseCreature(creatureId)
    })
  }
}
