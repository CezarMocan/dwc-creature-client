import request from 'request'
import { GARDENS } from '../../constants'
import { MAPPING } from './gardenCreatureMap'


const ENDPOINT = '/hello'

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