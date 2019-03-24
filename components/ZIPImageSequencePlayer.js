import React from 'react'
import PNGSequencePlayer from './PNGSequencePlayer'
import { unzipImagesFromArchive } from '../utils/zip'

export default class CentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      frames: null
    }
  }

  async extractFrames() {
    const { noFrames, zipPath, frameFilenameFn } = this.props
    const frames = await unzipImagesFromArchive(zipPath, noFrames, frameFilenameFn)
    this.setState({ frames })
  }

  componentDidMount() {
    this.extractFrames()
  }

  async componentDidUpdate(oldProps) {
    const { zipPath } = this.props
    if (zipPath != oldProps.zipPath) {
      this.extractFrames()
    }
  }

  render() {
    const { frames } = this.state
    if (!frames) return null

    const { noFrames, zipPath, frameFilenameFn, ...props } = this.props
    return (
      <PNGSequencePlayer
        loopImages={frames}
        {...props}
      />
    )
  }
}