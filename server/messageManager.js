import fs from 'fs'
import { getGardenName } from './config'
import { MESSAGES_SAVE_PATH } from '../constants'

class MessageManager {
  constructor() {
    this.messages = {}      
  }
  addMessageForCreature(creatureId, clientId, message) {
    console.log('*** MESSAGE ** ', creatureId, clientId, message)

    if (!this.messages[creatureId]) this.messages[creatureId] = []
    this.messages[creatureId].push({ creatureId, clientId, message, timestamp: Date.now() })
    this._backupToDisk(JSON.stringify(this.messages, null, 2))
  }
  getMessagesForCreature(creatureId) {    
    return this.messages[creatureId] || []
  }
  getAllMessages() {
    return this.messages
  }

  _backupToDisk(data) {
    const fileName = `${getGardenName()}-${Date.now()}.json`
    fs.writeFile(`${MESSAGES_SAVE_PATH}/${fileName}`, data, 'utf8', () => {
      console.log('Write file done: ', `${MESSAGES_SAVE_PATH}/${fileName}`)
    })
  }
}

export default new MessageManager()