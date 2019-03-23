import React from 'react'
import RainParticleSystem from './RainParticleSystem'
import Plant from './Plant'

const NO_FRAMES = [-1, 100, 100, 60, 68, 80, 40]

const PLANTS = {
  1: {
    noFrames: NO_FRAMES[1],
    images: [...Array(NO_FRAMES[1]).keys()].map(k => `/static/images/decentralized/garden/1/${k+1}.png`),
    xPct: 20,
    yPct: 30,
    radius: 15
  },
  2: {
    noFrames: NO_FRAMES[2],
    images: [...Array(NO_FRAMES[2]).keys()].map(k => `/static/images/decentralized/garden/2/${k+1}.png`),
    xPct: 20,
    yPct: 70,
    radius: 25
  },
  3: {
    noFrames: NO_FRAMES[3],
    images: [...Array(NO_FRAMES[3]).keys()].map(k => `/static/images/decentralized/garden/3/${k+1}.png`),
    xPct: 50,
    yPct: 20,
    radius: 12
  },
  4: {
    noFrames: NO_FRAMES[4],
    images: [...Array(NO_FRAMES[4]).keys()].map(k => `/static/images/decentralized/garden/4/${k+1}.png`),
    xPct: 60,
    yPct: 75,
    radius: 22
  },
  5: {
    noFrames: NO_FRAMES[5],
    images: [...Array(NO_FRAMES[5]).keys()].map(k => `/static/images/decentralized/garden/5/${k+1}.png`),
    xPct: 80,
    yPct: 25,
    radius: 18
  },
  6: {
    noFrames: NO_FRAMES[6],
    images: [...Array(NO_FRAMES[6]).keys()].map(k => `/static/images/decentralized/garden/6/${k+1}.png`),
    xPct: 70,
    yPct: 75,
    radius: 19
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
      plantGrowing: getNoGrowthState()
    }
    this.noPlants = 3
    this.plants = [1, 2, 3, 5, 6]

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.updatePlantGrowth = this.updatePlantGrowth.bind(this)
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
    const { touching, touchX, touchY } = this.state
    const plantGrowing = getNoGrowthState()

    if (touching) {
      const touchXPct = touchX / window.innerWidth * 100
      const touchYPct = touchY / window.innerHeight * 100

      this.plants.forEach(key => {
        const p = PLANTS[key]
        if (this.touchInRadius(touchXPct, touchYPct, p.xPct, p.yPct, p.radius))
          plantGrowing[key] = true
      })
    }

    this.setState({ plantGrowing })
  }

  onTouchStart(e) {
    let touch
    if (e.type == 'touchstart') {
      touch = e.touches[0] || e.changedTouches[0];
    } else {
      touch = e
    }

    console.log(e)

    this.setState({
      touching: true,
      touchX: touch.pageX,
      touchY: touch.pageY
    }, () => {
      this.updatePlantGrowth()
    })
    console.log('onTouchStart: ', e.type, touch.pageX, touch.pageY)
  }

  onTouchMove(e) {
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
    console.log('onTouchEnd')
    this.setState({ touching: false }, () => {
      this.updatePlantGrowth()
    })
  }

  render() {
    const { touching, touchX, touchY, plantGrowing } = this.state
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
          return (<Plant key={`plant-${k}`} obj={PLANTS[k]} growing={plantGrowing[k]} xPct={PLANTS[k].xPct} yPct={PLANTS[k].yPct} widthPct={2 * PLANTS[k].radius}/>)
        })}
        <RainParticleSystem active={touching} x={touchX} y={touchY}/>
      </div>
    )
  }
}