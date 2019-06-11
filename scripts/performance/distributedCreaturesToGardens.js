import { GARDENS, CREATURES } from '../../constants'
import { sendCreatureToGarden } from './sendCreatureToGarden'

const DELAY = 2500

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms))

// Sending the first 15 creatures to the ALPHA garden.
const distributedCreaturesToGardens = async () => {
  for (let i = 0; i < 15; i++) {
    await sendCreatureToGarden(Object.keys(CREATURES)[i], Object.keys(GARDENS)[0])
    await sleep(DELAY + (Math.random() - 0.5) * 600)
    console.log('Released creature: ', Object.keys(CREATURES)[i])  
  }
}

distributedCreaturesToGardens()