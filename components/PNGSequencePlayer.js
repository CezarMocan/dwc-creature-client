import React from 'react'
import classnames from 'classnames'

export default class PNGSequencePlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
    }

    this.tick = this.tick.bind(this)
  }

  tick() {
    if (!this.props.inViewport) return
    const { currentIndex } = this.state
    const { loopImages, loop, onEnd } = this.props
    const nextIndex = (currentIndex + 1) % (loopImages.length)

    if (nextIndex == 0) onEnd()
    if (nextIndex == 0 && !loop) {
      this.stop()
      return
    }

    this.setState({ currentIndex: nextIndex })      

  }

  play() {
    console.log('png sequence registerListener')
    this._tickerId = GlobalTicker.registerListener(this.tick)
  }

  stop() {
    if (!this._tickerId) return
    GlobalTicker.unregisterListener(this._tickerId)
    this._tickerId = null
  }

  componentDidMount() {
    const { isPlaying } = this.props
    if (isPlaying) this.play()
  }

  componentDidUpdate(oldProps) {
    const { isPlaying } = this.props
    if (isPlaying && !oldProps.isPlaying) this.play()
    if (!isPlaying && oldProps.isPlaying) this.stop()
  }

  componentWillUnmount() {
    this.stop()
  }

  render() {
    const { loopImages, loop, onEnd, inViewport, isPlaying, ...props } = this.props
    const { currentIndex } = this.state

    const currPath = loopImages[currentIndex]

    return (
      <div {...props}>
        <div className="png-sequence-container">
          {
            /*
            images.map((path, index) => {
              const isActive = (index == currentIndex)
              const classNames = classnames({
                'image-in-sequence-active': isActive,
                'image-in-sequence': true
              })

              return (
                <img key={index} src={path} className={classNames}/>
              )
            })
            */
          }
          <img src={currPath} className="image-in-sequence image-in-sequence-active"/>
        </div>
      </div>
    )
  }
}

PNGSequencePlayer.defaultProps = {
  loop: false,
  isPlaying: true,
  loopImages: [],
  inViewport: true,
  onEnd: () => {},  
}

class Ticker {
  constructor(fps) {
    this.fps = fps
    this.id = -1
    this.tick = this.tick.bind(this)
    this.listeners = {}
    this.listenersCount = 0
  }
  startTicker() {
    this.id = setInterval(this.tick, 1000 / this.fps)
  }
  stopTicker() {
    clearInterval(this.id)
  }
  registerListener(l) {
    const key = ++this.listenersCount
    this.listeners[key] = l
    return key
  }
  unregisterListener(key) {
    if (!this.listeners[key]) return
    delete this.listeners[key]
  }
  tick() {
    Object.values(this.listeners).forEach(l => l())
  }
}

export const GlobalTicker = new Ticker(12)
GlobalTicker.startTicker()