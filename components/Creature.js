import React from 'react'
import Head from 'next/head'
import classnames from 'classnames'
import PNGSequencePlayer from './PNGSequencePlayer'
import { GlobalTicker } from './Ticker'
import { PERFORMANCE_PHASES, CREATURES } from '../constants'
import {Howl, Howler} from 'howler'

const CREATURE_TAP_STOP_TIME = 10
const NO_LOOPING_FRAMES = 6

const getInitialX = () => -100
const getInitialY = () => window.innerHeight ? (window.innerHeight / 2 - 50) : 250

export default class CreatureComponent extends React.Component {
  constructor(props) {
    super(props)
    this.onRef = this.onRef.bind(this)
    this.update = this.update.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onGardenNameClick = this.onGardenNameClick.bind(this)

    this.movementSpeed = this.generateMovementSpeed()

    this.anim = {
      x: getInitialX(),
      y: getInitialY(),
      rotation: 0,
      rotationSgn: 1
    }

    this.state = {
      tapped: false,
      nextGarden: null
    }

    this.creatureSound = new Howl({
      src: ['/static/audio/walking.mp3'],
      autoplay: false,
      loop: true
    })
  }

  generateMovementSpeed() {
    return 3.5 + (Math.random() * 2.5)
  }

  onTouchStart() {
    this.setState({
      tapped: true
    }, () => {
      setTimeout(() => {
        this.setState({ tapped: false })
      }, CREATURE_TAP_STOP_TIME * 1000)
    })
  }

  onTouchEnd() {
    this.setState({ tapped: false })
  }

  onGardenNameClick(gardenName, evt) {
    evt.stopPropagation()

    this.setState({ nextGarden: gardenName }, () => {
      setTimeout(() => {
        this.setState({ tapped: false })
      }, 2500)
    })
  }

  resetPosition() {
    this.anim.x = getInitialX()
    this.anim.y = getInitialY()
  }

  startTicker() {
    this.movementSpeed = this.generateMovementSpeed()
    if (!this._tickerId)
      this._tickerId = GlobalTicker.registerListener(this.update)
  }

  stopTicker() {
    if (!this._tickerId) return
    GlobalTicker.unregisterListener(this._tickerId)
    this._tickerId = null
  }

  onRef(e) {
    this._e = e
    const { isActive } = this.props
    if (isActive) {
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
    const { tapped } = this.state

    // Don't move while in the tapped state
    if (!tapped) {
      this.anim.x += this.movementSpeed
    }

    this.anim.y += Math.sin(time / 10) * 2

    this.anim.rotation += Math.abs(Math.sin(time) * Math.cos(time)) * this.anim.rotationSgn
    if (this.anim.rotation > 10) {
      this.anim.rotationSgn = -1
    } else if (this.anim.rotation < -10) {
      this.anim.rotationSgn = 1
    }

    this._e.style.transform = `translateX(${this.anim.x}px) translateY(${this.anim.y + creatureYOffset}px) rotate(${this.anim.rotation}deg)`
  }

  getNextGarden() {
    const { gardenConfig } = this.props
    const localGardenName = this.props.gardenConfig.localGarden ? this.props.gardenConfig.localGarden.name : undefined

    if (gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED) {
      return localGardenName
    }
    else {
      // If we're in the distributed phase, send creature to a garden at random
      const rand3 = parseInt(Math.floor(Math.random() * 3))
      if (rand3 == 2) return localGardenName
      else return Object.values(gardenConfig.remoteGardens)[rand3].name
    }
    // const localGardenName = this.props.gardenConfig.localGarden ? this.props.gardenConfig.localGarden.name : undefined
    // return (this.state.nextGarden || localGardenName)
  }

  update() {
    const { isActive, onExit, creatureId } = this.props
    if (!isActive) return

    this.updateCreaturePosition()

    if (this.outOfBounds()) {
      this.resetPosition()
      const nextGarden = this.getNextGarden()
      console.log('nextGarden is: ', nextGarden)
      onExit(creatureId, nextGarden)
      this.stopTicker()
      this.setState({ nextGarden: null })
    } else {
      // requestAnimationFrame(this.update)
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.isActive != this.props.isActive) return true
    if (newState.tapped != this.state.tapped) return true
    if (newState.nextGarden != this.state.nextGarden) return true
    return false
  }

  componentDidUpdate(oldProps) {
    const { isActive } = this.props
    if (isActive && !oldProps.isActive) {
      this.resetPosition()
      this.startTicker()
      this.creatureSound.play()
    } else if (!isActive && oldProps.isActive) {
      this.stopTicker()
      this.creatureSound.pause()
    }
  }

  componentWillUnmount() {
    this.stopTicker()
    this.creatureSound.pause()
  }

  componentDidMount() {
    if (this.props.isActive)
    this.creatureSound.play()
  }

  render() {
    const { isActive, creatureId, gardenConfig } = this.props
    const { tapped, nextGarden } = this.state
    const showCreature = isActive
    const framesFolder = CREATURES[creatureId].folder
    const creatureClassName = CREATURES[creatureId].className
    return (
      <div
        ref={(e) => {this.onRef(e)}}
        className={`creature ${showCreature ? '' : 'hidden'}`}
        style={{transform: `translateX(${this.anim.x}px) translateY(${this.anim.y}px) rotate(${this.anim.rotation}deg)`}}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onMouseDown={this.onTouchStart}
        onMouseUp={this.onTouchEnd}
      >
          <PNGSequencePlayer
            loopImages={[...Array(NO_LOOPING_FRAMES).keys()].map(k => `/static/images/creatures/${framesFolder}/${k}.png`)}
            isPlaying={isActive}
            loop={true}
            className={creatureClassName}
            imageClassName="reversed-x"
            inViewport={true}
            withPreload={true}
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

/*gardenConfig && tapped &&
  <div className="creature-interaction-dialog">
    <div className="prompt">Would you like to send me to another garden?</div>
    { Object.values(gardenConfig.remoteGardens).map((garden, index) => {
      const gardenClass = classnames({
        'garden-option': true,
        'garden-option-selected': garden.name == nextGarden
      })
      return (<div key={garden.name} className={gardenClass} onClick={this.onGardenNameClick.bind(this, garden.name)}>{garden.name}</div>)
    })}
  </div>
*/
