class MessageManager {
  constructor() {
    this.messages = {}      
  }
  addMessageForCreature(creatureId, clientId, message) {
    console.log('*** MESSAGE ** ', creatureId, clientId, message)

    if (!this.messages[creatureId]) this.messages[creatureId] = []
    this.messages[creatureId].push({ creatureId, clientId, message, timestamp: Date.now() })
  }
  getMessagesForCreature(creatureId) {    
    return this.messages[creatureId] || []
  }
  getAllMessages() {
    return this.messages
  }
}

export default new MessageManager()