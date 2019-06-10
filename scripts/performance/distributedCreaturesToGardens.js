import { GARDENS, CREATURES } from '../../constants'
import { sendCreatureToGarden } from './sendCreatureToGarden'

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms))

// Sending the first 15 creatures to the ALPHA garden.
const distributedCreaturesToGardens = async () => {
  await sendCreatureToGarden(Object.keys(CREATURES)[0], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)

  await sendCreatureToGarden(Object.keys(CREATURES)[1], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)

  await sendCreatureToGarden(Object.keys(CREATURES)[2], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[3], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[4], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[5], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[6], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[7], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[8], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[9], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[10], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[11], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[12], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[13], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[14], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
  
  await sendCreatureToGarden(Object.keys(CREATURES)[15], Object.keys(GARDENS)[0])
  await sleep(1000 + (Math.random() - 0.5) * 600)
}

distributedCreaturesToGardens()