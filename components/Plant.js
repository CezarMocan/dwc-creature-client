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
      lastFrames: images.slice(Math.max(images.length - this.LOOPING_LAST_FRAMES, 1))
    }
  }
  onEnd() {
    this.setState({ doneGrowing: true })
  }
  render() {
    const { xPct, yPct, widthPct, growing, obj } = this.props
    const { doneGrowing, lastFrames } = this.state
    const style = {
      maxWidth: `${widthPct}vw`,
      left: `${xPct}vw`,
      top: `${yPct}vh`
    }
    return (
      <div className="plant-container" style={style}>
        { !doneGrowing &&
          <PNGSequencePlayer
            loopImages={obj.images}
            isPlaying={growing}
            loop={false}
            className="plant-sequence-container"
            imageClassName="plant-image"
            inViewport={true}
            withPreload={true}
            onEnd={this.onEnd}
          />
        }
        {
          doneGrowing &&
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
  widthPct: 0,
  growing: false,
  obj: null
}