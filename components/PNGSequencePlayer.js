import React from 'react'
import classnames from 'classnames'
import { GlobalTicker } from './Ticker'

const sleep = (time) => new Promise(res => setTimeout(() => res(), time * 1000))

export default class PNGSequencePlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
    }

    this.tick = this.tick.bind(this)
    if (props.withPreload) {
      this.preload()
    }
  }

  async preload() {
    const { loopImages } = this.props
    let index = 0
    for (let image of loopImages) {
      index++
      if (index % 30 == 0) await sleep(0.01)
      const img = new Image()
      img.src = image
    }
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
    const { loopImages, loop, onEnd, inViewport, isPlaying, withPreload, imageClassName, ...props } = this.props
    const { currentIndex } = this.state

    const currPath = loopImages[currentIndex]
    const imageCls = classnames({
      'image-in-sequence': true,
      'image-in-sequence-active': true,
      [imageClassName]: true
    })

    return (
      <div {...props}>
        <div className="png-sequence-container">
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
  withPreload: false,
  imageClassName: ""
}