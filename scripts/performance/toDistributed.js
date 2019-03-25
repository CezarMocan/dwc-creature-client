import request from 'request'
import { GARDENS, PERFORMANCE_PHASES } from '../../constants'

const ENDPOINT = '/changePhase'

Object.keys(GARDENS).forEach(name => {
  const destination = `${GARDENS[name].address}:${GARDENS[name].port}`
  request.post(`${destination}${ENDPOINT}`, {
    form: {
      phase: PERFORMANCE_PHASES.DISTRIBUTED
    }
  }, (err, res, body) => {
    console.log('[ Garden', name, ']: ', body)
  })
})