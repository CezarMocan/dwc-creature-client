import React from 'react'
import Head from 'next/head'
import classnames from 'classnames'
import PNGSequencePlayer from './PNGSequencePlayer'
import { GlobalTicker } from './Ticker'

const CREATURE_TAP_STOP_TIME = 10
const NO_LOOPING_FRAMES = 8

const getInitialX = () => -100
const getInitialY = () => window.innerHeight ? (window.innerHeight / 2 - 50) : 250

export default class CreatureComponent extends React.Component {
  constructor(props) {
    super(props)
    this.onRef = this.onRef.bind(this)
    this.update = this.update.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onGardenNameClick = this.onGardenNameClick.bind(this)

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
  }

  onClick() {
    if (this.state.tapped) {
      this.setState({ tapped: false })
    } else {
      this.setState({ tapped: true }, () => {
        setTimeout(() => {
          this.setState({ tapped: false })
        }, CREATURE_TAP_STOP_TIME * 1000)
      })
    }
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
      this.anim.x += 4
    }

    this.anim.y += Math.sin(time / 10) * 2

    this.anim.rotation += Math.abs(Math.sin(time) * Math.cos(time)) * this.anim.rotationSgn
    if (Math.abs(this.anim.rotation) > 10) {
      this.anim.rotationSgn *= -1
    }

    this._e.style.transform = `translateX(${this.anim.x}px) translateY(${this.anim.y + creatureYOffset}px) rotate(${this.anim.rotation}deg)`
  }

  getNextGarden() {
    const localGardenName = this.props.gardenConfig.localGarden ? this.props.gardenConfig.localGarden.name : undefined
    return (this.state.nextGarden || localGardenName)
  }

  update() {
    const { isActive, onExit, creatureId } = this.props
    if (!isActive) return

    this.updateCreaturePosition()

    if (this.outOfBounds()) {
      this.resetPosition()
      const nextGarden = this.getNextGarden()
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
    const { isActive, creatureId, gardenConfig } = this.props
    const { tapped, nextGarden } = this.state
    const showCreature = isActive
    return (
      <div
        ref={(e) => {this.onRef(e)}}
        className={`creature ${showCreature ? '' : 'hidden'}`}
        style={{transform: `translateX(${this.anim.x}px) translateY(${this.anim.y}px) rotate(${this.anim.rotation}deg)`}}
        onClick={this.onClick}
      >
          {creatureId}
          <PNGSequencePlayer
            loopImages={[...Array(NO_LOOPING_FRAMES).keys()].map(k => `/static/images/creature1/${k}.png`)}
            isPlaying={isActive && !tapped}
            loop={true}
            className="creature-1"
            inViewport={true}
          />
          { gardenConfig && tapped &&
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
          }
      </div>
    )
  }
}

CreatureComponent.defaultProps = {
  onExit: () => {},
  isActive: false,
  creatureId: 0
}