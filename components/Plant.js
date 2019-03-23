import React from 'react'
import PNGSequencePlayer from './PNGSequencePlayer'

export default class Plant extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { xPct, yPct, widthPct, growing, obj } = this.props
    const style = {
      maxWidth: `${widthPct}vw`,
      transform: `translateX(${xPct}vw) translateY(${yPct}vh)`
    }
    return (
      <div className="plant-container" style={style}>
        <PNGSequencePlayer
          loopImages={obj.images}
          isPlaying={growing}
          loop={false}
          className="plant-sequence-container"
          imageClassName="plant-image"
          inViewport={true}
          withPreload={true}
        />
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