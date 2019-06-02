import React from 'react'
import PNGSequencePlayer from './PNGSequencePlayer'

export default class Plant extends React.Component {
  constructor(props) {
    super(props)
    this.onEnd = this.onEnd.bind(this)

    this.LOOPING_LAST_FRAMES = 3
    const images = props.obj.images
    this.state = {
      doneGrowing: false,
      lastFrames: images.slice(Math.max(images.length - this.LOOPING_LAST_FRAMES, 1)),
    }

    this.tapped = false

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }
  onTouchStart(evt) {
    const { draggable, onTouchStart, plantId } = this.props
    if (draggable && onTouchStart) onTouchStart(evt, plantId)
    this.tapped = true
  }
  onTouchMove(evt) {
    if (!this.tapped) return
    const { draggable, onTouchMove, plantId } = this.props
    if (draggable && onTouchMove) onTouchMove(evt, plantId)
  }
  onTouchEnd(evt) {
    const { draggable, onTouchEnd, plantId } = this.props
    if (draggable && onTouchEnd) onTouchEnd(evt, plantId)
    this.tapped = false
  }
  onEnd() {
    this.setState({ doneGrowing: true })
  }
  render() {
    const { xPct, yPct, widthPct, growing, obj, xOffsetPx, yOffsetPx, showGrown } = this.props
    const { doneGrowing, lastFrames } = this.state
    const style = {
      maxWidth: `${widthPct}vw`,
      minWidth: `${widthPct}vw`,
      left: `calc(${xPct}% + ${xOffsetPx}px)`,
      top: `calc(${yPct}% + ${yOffsetPx}px)`
    }
    return (
      <div
        className="plant-container"
        style={style}
        onMouseDown={this.onTouchStart}
        onTouchStart={this.onTouchStart}
        onMouseMove={this.onTouchMove}
        onTouchMove={this.onTouchMove}
        onMouseUp={this.onTouchEnd}
        onTouchEnd={this.onTouchEnd}
      >
        { (!doneGrowing && !showGrown) &&
          <PNGSequencePlayer
            loopImages={obj.images}
            isPlaying={growing}
            loop={false}
            className="plant-sequence-container"
            imageClassName="plant-image"
            inViewport={true}
            withPreload={false}
            onEnd={this.onEnd}
          />
        }
        {
          (doneGrowing || showGrown) &&
          <PNGSequencePlayer
            loopImages={lastFrames}
            isPlaying={true}
            loop={true}
            className="plant-sequence-container"
            imageClassName="plant-image"
            inViewport={true}
            withPreload={false}
          />
        }
      </div>
    )
  }
}

Plant.defaultProps = {
  xPct: 0,
  yPct: 0,
  xOffsetPx: 0,
  yOffsetPx: 0,
  widthPct: 0,
  growing: false,
  obj: null,
  tappable: false,
  showGrown: false,
  plantId: -1,
  onTouchStart: () => {},
  onTouchEnd: () => {}
}