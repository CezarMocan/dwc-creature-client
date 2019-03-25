import request from 'request'
import { GARDENS } from '../../constants'

const ENDPOINT = '/centralized/start'

Object.keys(GARDENS).forEach(name => {
  const destination = `${GARDENS[name].address}:${GARDENS[name].port}`
  request.post(`${destination}${ENDPOINT}`, {
    form: {}
  }, (err, res, body) => {
    console.log('[ Garden', name, ']: ', body)
  })
})