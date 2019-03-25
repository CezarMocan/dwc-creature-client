import { GARDENS, PERFORMANCE_PHASES, CREATURES } from '../../constants'

const g = Object.keys(GARDENS)
const c = Object.keys(CREATURES)
// Sending creature1 to alpha, creature2 to beta, creature3 to gamma
export const MAPPING = {
  [g[0]]: c[0],
  [g[1]]: c[1],
  [g[2]]: c[2]
}
