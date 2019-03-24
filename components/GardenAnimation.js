import React from 'react'
import RainParticleSystem from './RainParticleSystem'
import Plant from './Plant'
import { PERFORMANCE_PHASES } from '../constants'

const NO_FRAMES = [-1, 100, 100, 60, 80, 80, 40]

const POSITIONS = [
  {
    xPct: 20,
    yPct: 20,
    radius: 15
  },
  {
    xPct: 20,
    yPct: 45,
    radius: 25
  },
  {
    xPct: 50,
    yPct: 20,
    radius: 12
  },
  {
    xPct: 44,
    yPct: 66,
    radius: 22
  },
  {
    xPct: 80,
    yPct: 25,
    radius: 18
  },
  {
    xPct: 75,
    yPct: 70,
    radius: 19
  }
]

const PLANTS = {
  1: {
    noFrames: NO_FRAMES[1],
    images: [...Array(NO_FRAMES[1]).keys()].map(k => `/static/images/decentralized/garden/1/${k}.png`),
  },
  2: {
    noFrames: NO_FRAMES[2],
    images: [...Array(NO_FRAMES[2]).keys()].map(k => `/static/images/decentralized/garden/2/${k}.png`),
  },
  3: {
    noFrames: NO_FRAMES[3],
    images: [...Array(NO_FRAMES[3]).keys()].map(k => `/static/images/decentralized/garden/3/${k}.png`),
  },
  4: {
    noFrames: NO_FRAMES[4],
    images: [...Array(NO_FRAMES[4]).keys()].map(k => `/static/images/decentralized/garden/4/${k}.png`),
  },
  5: {
    noFrames: NO_FRAMES[5],
    images: [...Array(NO_FRAMES[5]).keys()].map(k => `/static/images/decentralized/garden/5/${k}.png`),
  },
  6: {
    noFrames: NO_FRAMES[6],
    images: [...Array(NO_FRAMES[6]).keys()].map(k => `/static/images/decentralized/garden/6/${k}.png`),
  }
}

const getNoGrowthState = () => {
  return Object.keys(PLANTS).reduce((acc, key) => {
    acc[key] = false
    return acc
  }, {})
}

export default class DecentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      touching: false,
      touchX: 0,
      touchY: 0,
      plantGrowing: getNoGrowthState(),
      plants: [],
      plantsInfo: {}
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.updatePlantGrowth = this.updatePlantGrowth.bind(this)
  }

  get isDecentralizedPhase() {
    const { gardenConfig } = this.props
    return gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED
  }

  get plants(){
    return this.state.plants
  }

  rand(a, b) {
    return a + parseInt(Math.floor(Math.random() * (b - a + 1)))
  }

  pickN(n, arr) {
    const picked = {}
    let found = 0
    while (found < n) {
      let index = this.rand(0, arr.length - 1)
      if (!picked[index]) {
        picked[index] = true
        found++
      }
    }

    return Object.keys(picked).map(k => arr[k])
  }

  generateLayout() {
    let plants, plantsInfo

    if (!localStorage.getItem('plants') || !localStorage.getItem('plantsInfo')) {
      const noPlants = this.rand(3, 5)
      plants = this.pickN(noPlants, Object.keys(PLANTS))

      plantsInfo = {}
      const positions = this.pickN(noPlants, POSITIONS)
      plants.forEach((p, index) => {
        plantsInfo[p] = { ...PLANTS[p], ...positions[index] }
      })

      localStorage.setItem('plants', JSON.stringify(plants))
      localStorage.setItem('plantsInfo', JSON.stringify(plantsInfo))
    } else {
      plants = JSON.parse(localStorage.getItem('plants'))
      plantsInfo = JSON.parse(localStorage.getItem('plantsInfo'))
    }

    console.log(plants, plantsInfo)

    this.setState({ plants, plantsInfo })
  }

  touchInRadius(x, y, pX, pY, pR) {
    // Move plant center higher up, so we can rain more above
    const nX = x
    const nY = y + pR * 0.75

    const dX = nX - pX
    const dY = nY - pY
    if (dX * dX + dY * dY <= pR * pR) return true
    return false
  }

  updatePlantGrowth() {
    const { touching, touchX, touchY, plantsInfo } = this.state
    const plantGrowing = getNoGrowthState()

    if (touching) {
      const touchXPct = touchX / window.innerWidth * 100
      const touchYPct = touchY / window.innerHeight * 100

      this.plants.forEach(key => {
        const p = plantsInfo[key]
        if (this.touchInRadius(touchXPct, touchYPct, p.xPct, p.yPct, p.radius))
          plantGrowing[key] = true
      })
    }

    this.setState({ plantGrowing })
  }

  onTouchStart(e) {
    if (!this.isDecentralizedPhase) return

    let touch
    if (e.type == 'touchstart') {
      touch = e.touches[0] || e.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touching: true,
      touchX: touch.pageX,
      touchY: touch.pageY
    }, () => {
      this.updatePlantGrowth()
    })
  }

  onTouchMove(e) {
    if (!this.isDecentralizedPhase) return

    const { touching } = this.state
    if (!touching) return

    let touch
    if (e.type == 'touchmove') {
      touch = e.touches[0] || e.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touchX: touch.pageX,
      touchY: touch.pageY
    }, () => {
      this.updatePlantGrowth()
    })
  }

  onTouchEnd(e) {
    if (!this.isDecentralizedPhase) return

    this.setState({ touching: false }, () => {
      this.updatePlantGrowth()
    })
  }

  componentDidMount() {
    this.generateLayout()
  }

  render() {
    const { gardenConfig } = this.props
    const { touching, touchX, touchY, plantGrowing, plantsInfo } = this.state
    return (
      <div className="decentralized-animation"
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        onMouseDown={this.onTouchStart}
        onMouseMove={this.onTouchMove}
        onMouseUp={this.onTouchEnd}
      >
        { this.plants.map(k => {
          return (<Plant
            key={`plant-${k}`}
            obj={plantsInfo[k]}
            growing={plantGrowing[k] || !this.isDecentralizedPhase}
            xPct={plantsInfo[k].xPct}
            yPct={plantsInfo[k].yPct}
            widthPct={2 * plantsInfo[k].radius}/>)
        })}
        { this.isDecentralizedPhase &&
          <RainParticleSystem active={touching} x={touchX} y={touchY}/>
        }
      </div>
    )
  }
}