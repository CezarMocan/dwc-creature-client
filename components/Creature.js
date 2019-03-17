import React from 'react'
import Head from 'next/head'
import PNGSequencePlayer, { GlobalTicker } from './PNGSequencePlayer'

const NO_LOOPING_FRAMES = 8

const getInitialX = () => -100
const getInitialY = () => window.innerHeight ? (window.innerHeight / 2 - 50) : 250

export default class CreatureComponent extends React.Component {
  constructor(props) {
    super(props)
    this.onRef = this.onRef.bind(this)
    this.update = this.update.bind(this)

    this.anim = {
      x: getInitialX(),
      y: getInitialY(),
      rotation: 0,
      rotationSgn: 1
    }
  }

  resetPosition() {
    this.anim.x = getInitialX()
    this.anim.y = getInitialY()
  }

  startTicker() {
    if (!this._tickerId)
      this._tickerId = GlobalTicker.registerListener(this.update)
  }

  stopTicker() {
    if (!this._tickerId) return
    GlobalTicker.unregisterListener(this._tickerId)
    this._tickerId = null
  }

  onRef(e) {
    this.resetPosition()
    this._e = e
    const { isActive } = this.props
    if (isActive) {
      console.log('onRef registerListener')
      this.startTicker()
    }
  }

  outOfBounds() {
    // if (this.anim.x < -100) return true
    // if (this.anim.y < 0) return true
    if (this.anim.x > window.innerWidth) return true
    if (this.anim.y > window.innerHeight) return true
    return false
  }

  updateCreaturePosition() {
    if (!this._e) return

    const creatureYOffset = 0//this.props.creatureId * 50

    const time = Date.now()

    this.anim.x += 4
    this.anim.y += Math.sin(time / 10) * 2

    this.anim.rotation += Math.abs(Math.sin(time) * Math.cos(time)) * this.anim.rotationSgn
    if (Math.abs(this.anim.rotation) > 10) {
      this.anim.rotationSgn *= -1
    }

    this._e.style.transform = `translateX(${this.anim.x}px) translateY(${this.anim.y + creatureYOffset}px) rotate(${this.anim.rotation}deg)`
  }

  update() {
    const { isActive, onExit, creatureId } = this.props
    if (!isActive) return

    this.updateCreaturePosition()

    if (this.outOfBounds()) {
      this.resetPosition()
      onExit(creatureId)
      this.stopTicker()
    } else {
      // requestAnimationFrame(this.update)
    }
  }

  shouldComponentUpdate(newProps) {
    if (newProps.isActive != this.props.isActive) return true
    return false
  }

  componentDidUpdate(oldProps) {
    const { isActive } = this.props
    console.log('componentDidUpdate: ', this.props.isActive, oldProps.isActive, this.props.creatureId)
    if (isActive && !oldProps.isActive) {
      this.resetPosition()
      this.startTicker()
    } else if (!isActive && oldProps.isActive) {
      this.stopTicker()
    }
  }

  componentWillUnmount() {
    this.stopTicker()
  }

  componentDidMount() {
    console.log('Creature componentDidMount')
  }

  render() {
    const { isActive, creatureId } = this.props
    return (
      <div className={`creature ${isActive ? '' : 'hidden'}`} ref={(e) => {this.onRef(e)}}>
        {creatureId}
        <PNGSequencePlayer
          loopImages={[...Array(NO_LOOPING_FRAMES).keys()].map(k => `/static/images/creature1/${k}.png`)}
          isPlaying={isActive}
          loop={true}
          className="creature-1"
          inViewport={true}
        />

      </div>
    )
  }
}

CreatureComponent.defaultProps = {
  onExit: () => {},
  isActive: false,
  creatureId: 0
}