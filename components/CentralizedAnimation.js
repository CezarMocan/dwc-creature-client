import React from 'react'
import ZIPImageSequencePlayer from './ZIPImageSequencePlayer'

const zeroPad = (num, places) => {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

const NO_FRAMES = 1440
const ZIP_PATH = '/static/images/centralized/svg_sequence.zip'
const FRAME_FILE_FN = (index) => `svg_sequence/Animated_1${zeroPad(index, 4)}.svg`

export default class CentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { playing } = this.props
    return (
      <div className="creature-birth-container">
        <ZIPImageSequencePlayer
          noFrames={NO_FRAMES}
          zipPath={ZIP_PATH}
          frameFilenameFn={FRAME_FILE_FN}
          isPlaying={playing}
          loop={false}
          className="creature-birth"
          imageClassName="creature-birth-image"
          inViewport={true}
        />
      </div>
    )
  }
}