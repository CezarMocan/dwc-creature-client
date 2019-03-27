import request from 'request'
import { GARDENS, CREATURES } from '../../constants'
import { MAPPING } from './gardenCreatureMap'

const ENDPOINT = '/goodbye'

Object.keys(GARDENS).forEach(name => {
  const destination = `${GARDENS[name].address}:${GARDENS[name].port}`
  Object.keys(CREATURES).forEach(creature => {
    request.post(`${destination}${ENDPOINT}`, {
      form: {
        creature: creature
      }
    }, (err, res, body) => {
      console.log('[ Garden', name, ']: ', body)
    })
  })
})