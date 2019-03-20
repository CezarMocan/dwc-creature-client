var gardenName, performancePhase

export const setGarden = (name) => {
  gardenName = name
}

export const getGardenName = () => gardenName

export const setPerformancePhase = (newPhase) => {
  performancePhase = newPhase
}

export const isPerformancePhaseCentralized = () => {
  return performancePhase == PERFORMANCE_PHASES.CENTRALIZED
}

export const isPerformancePhaseDecentralized = () => {
  return performancePhase == PERFORMANCE_PHASES.DECENTRALIZED
}

export const isPerformancePhaseDistributed = () => {
  return performancePhase == PERFORMANCE_PHASES.DISTRIBUTED
}

export const getPerformancePhase = () => performancePhase

export const CREATURE_FORCE_MOVE_MS = 10000
export const CLIENT_HEARTBEAT_INACTIVE_THRESHOLD = 4000
export const GARDENS = {
  "alpha": {
    "address": "http://localhost",
    "port": 3001,
    name: "alpha"
  },
  "beta": {
    "address": "http://localhost",
    "port": 3002,
    name: "beta"
  },
  "gamma": {
    "address": "http://localhost",
    "port": 3003,
    name: "gamma"
  }
}

export const CREATURES = {

}

export const PERFORMANCE_PHASES = {
  'CENTRALIZED': 'centralized',
  'DECENTRALIZED': 'decentralized',
  'DISTRIBUTED': 'distributed'
}

export const getGardenConfig = () => {
  return GARDENS[gardenName]
}

export const getOtherGardens = () => {
  const otherGardens = {}
  Object.keys(GARDENS).forEach(garden => {
    if (garden == gardenName) return
    otherGardens[garden] = {...GARDENS[garden]}
  })  
  return otherGardens
}

export const getOtherGardenAddress = (name) => {
  return `${GARDENS[name].address}:${GARDENS[name].port}`
}