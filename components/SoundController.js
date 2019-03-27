import React from 'react'
import {Howl, Howler} from 'howler'

export default class SoundController extends React.Component {
  constructor(props) {
    super(props)

    this.centralized = new Howl({
      src: ['/static/audio/SoundScape.mp3'],
      autoplay: false,
      loop: false
    })

    this.decentralized = new Howl({
      src: ['/static/audio/background.mp3'],
      autoplay: false,
      loop: true,
      volume: 0.5
    })

    this.distributed = new Howl({
      src: ['/static/audio/garden.mp3'],
      autoplay: false,
      loop: true,
      volume: 0.5
    })

    // this.clip = null
  }
  setSoundFromState(soundState) {
    console.log('Update sound state: ', soundState)
    switch (soundState) {
      case SOUND_STATES.CENTRALIZED_PAUSED:
        this.centralized.pause()
        this.decentralized.pause()
        this.distributed.pause()
        break
      case SOUND_STATES.CENTRALIZED_PLAYING:
        this.centralized.play()
        this.decentralized.pause()
        this.distributed.pause()
        break
      case SOUND_STATES.DECENTRALIZED_NO_CREATURE:
        this.centralized.pause()
        this.decentralized.play()
        this.distributed.pause()
        break
      // case SOUND_STATES.DECENTRALIZED_WITH_CREATURE:
      //   if (this.clip) this.clip.pause()
      //   this.clip = new Clip({
      //     url: '/static/audio/walking.mp3',
      //     paused: false,
      //     loop: false
      //   })
      //   this.clip.buffer().then(() => this.clip.play())

      //   break
      case SOUND_STATES.DISTRIBUTED_NO_CREATURE:
        this.centralized.pause()
        this.decentralized.pause()
        this.distributed.play()
        break
      // case SOUND_STATES.DISTRIBUTED_WITH_CREATURE:
      //   if (this.clip) this.clip.pause()
      //   this.clip = new Clip({
      //     url: '/static/audio/walking.mp3',
      //     paused: false,
      //     loop: false
      //   })
      //   this.clip.buffer().then(() => this.clip.play())

      //   break
    }
  }
  componentDidUpdate(oldProps) {
    if (oldProps.soundState != this.props.soundState) {
      this.setSoundFromState(this.props.soundState)
    }
  }
  componentDidMount() {
    this.setSoundFromState(this.props.soundState)
  }
  render() {
    return null
    // return (
    //   <Sound
    //     url={url}
    //     playStatus={soundPlayStatus}
    //     autoLoad={true}
    //     volume={playing ? 100 : 1}
    //     loop={loop}
    //   />
    // )
  }
}

export const SOUND_STATES = {
  CENTRALIZED_PAUSED: 'CENTRALIZED_PAUSED',
  CENTRALIZED_PLAYING: 'CENTRALIZED_PLAYING',
  DECENTRALIZED_NO_CREATURE: 'DECENTRALIZED_NO_CREATURE',
  DECENTRALIZED_WITH_CREATURE: 'DECENTRALIZED_WITH_CREATURE',
  DISTRIBUTED_NO_CREATURE: 'DISTRIBUTED_NO_CREATURE',
  DISTRIBUTED_WITH_CREATURE: 'DISTRIBUTED_WITH_CREATURE'
}

SoundController.defaultProps = {
  initialized: false,
  soundState: SOUND_STATES.CENTRALIZED_PAUSED
}
