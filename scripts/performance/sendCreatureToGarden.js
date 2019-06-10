import request from 'request'
import { GARDENS, CREATURES } from '../../constants'

const ENDPOINT = '/hello'

const CREATURE = process.argv[2]
const GARDEN = process.argv[3]

export const sendCreatureToGarden = (creature, garden) => {
  if (!GARDENS[garden]) {
    console.error('No garden named: ', garden)
    return
  }
  
  if (!CREATURES[creature]) {
    console.error('No creature named: ', creature)
    return
  }
  
  console.log('Sending ', creature, 'to', garden)
  
  const destination = `${GARDENS[garden].address}:${GARDENS[garden].port}`
  
  return new Promise((resolve, reject) => {
    request.post(`${destination}${ENDPOINT}`, {
      form: {
        creature: creature
      }
    }, (err, res, body) => {
      console.log('[ Garden', garden, ']: ', body)
      resolve()
    })  
  })
}

sendCreatureToGarden(CREATURE, GARDEN)

