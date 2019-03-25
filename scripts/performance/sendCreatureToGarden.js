import request from 'request'
import { GARDENS, CREATURES } from '../../constants'
import { MAPPING } from './gardenCreatureMap'

const ENDPOINT = '/hello'

const CREATURE = process.argv[2]
const GARDEN = process.argv[3]

if (!GARDENS[GARDEN]) {
  console.error('No garden named: ', GARDEN)
  process.exit(0)
}

if (!CREATURES[CREATURE]) {
  console.error('No creature named: ', CREATURE)
  process.exit(0)
}

console.log('Sending ', CREATURE, 'to', GARDEN)

const destination = `${GARDENS[GARDEN].address}:${GARDENS[GARDEN].port}`

request.post(`${destination}${ENDPOINT}`, {
  form: {
    creature: CREATURE
  }
}, (err, res, body) => {
  console.log('[ Garden', GARDEN, ']: ', body)
})


/*
Object.keys(GARDENS).forEach(name => {
  const destination = `${GARDENS[name].address}:${GARDENS[name].port}`
  request.post(`${destination}${ENDPOINT}`, {
    form: {
      creature: MAPPING[name]
    }
  }, (err, res, body) => {
    console.log('[ Garden', name, ']: ', body)
  })
})
*/