import React from 'react'
import RainParticleSystem from './RainParticleSystem'
import Plant from './Plant'

const NO_FRAMES = [-1, 100, 100, 60, 68, 80, 40]

const PLANTS = {
  1: {
    noFrames: NO_FRAMES[1],
    images: [...Array(NO_FRAMES[1]).keys()].map(k => `/static/images/decentralized/garden/1/${k+1}.png`),
  },
  2: {
    noFrames: NO_FRAMES[2],
    images: [...Array(NO_FRAMES[2]).keys()].map(k => `/static/images/decentralized/garden/2/${k+1}.png`),
  },
  3: {
    noFrames: NO_FRAMES[3],
    images: [...Array(NO_FRAMES[3]).keys()].map(k => `/static/images/decentralized/garden/3/${k+1}.png`),
  },
  4: {
    noFrames: NO_FRAMES[4],
    images: [...Array(NO_FRAMES[4]).keys()].map(k => `/static/images/decentralized/garden/4/${k+1}.png`),
  },
  5: {
    noFrames: NO_FRAMES[5],
    images: [...Array(NO_FRAMES[5]).keys()].map(k => `/static/images/decentralized/garden/5/${k+1}.png`),
  },
  6: {
    noFrames: NO_FRAMES[6],
    images: [...Array(NO_FRAMES[6]).keys()].map(k => `/static/images/decentralized/garden/6/${k+1}.png`),
  }
}

export default class DecentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      touching: false,
      touchX: 0,
      touchY: 0
    }
    this.noPlants = 3
    this.plants = [1]

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  onTouchStart(e) {
    let touch
    if (e.type == 'touchstart') {
      touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touching: true,
      touchX: touch.pageX,
      touchY: touch.pageY
    })
    console.log('onTouchStart: ', e.type, touch.pageX, touch.pageY)
  }

  onTouchMove(e) {
    const { touching } = this.state
    if (!touching) return

    let touch
    if (e.type == 'touchstart') {
      touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touchX: touch.pageX,
      touchY: touch.pageY
    })
  }

  onTouchEnd(e) {
    console.log('onTouchEnd')
    this.setState({ touching: false })
  }

  render() {
    const { touching, touchX, touchY } = this.state
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
          return (<Plant key={`plant-${k}`} obj={PLANTS[k]} growing={touching} xPct={10} yPct={20} widthPct={30}/>)
        })}
        <RainParticleSystem active={touching} x={touchX} y={touchY}/>
      </div>
    )
  }
}