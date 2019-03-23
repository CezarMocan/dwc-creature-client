import React from 'react'
import PNGSequencePlayer from './PNGSequencePlayer'

const zeroPad = (num, places) => {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
const NO_LOOPING_FRAMES = 1440
const ARR = [...Array(NO_LOOPING_FRAMES).keys()].map(k => `/static/images/centralized/svg_sequence/Animated_1${zeroPad(k, 4)}.svg`)

export default class CentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { playing } = this.props
    return (
      <PNGSequencePlayer
        loopImages={ARR}
        isPlaying={playing}
        loop={false}
        className="creature-birth"
        inViewport={true}
        withPreload={true}
      />
    )
  }
}