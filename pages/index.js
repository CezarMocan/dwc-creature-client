import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import {Howl, Howler} from 'howler'
import Style from '../static/styles/main.less'
import Head from '../components/Head'
import Creature from '../components/Creature'
import { PERFORMANCE_PHASES } from '../constants'
import CentralizedAnimation from '../components/CentralizedAnimation'
import GardenAnimation from '../components/GardenAnimation'
import SoundController, { SOUND_STATES } from '../components/SoundController'
import InvisibleText from '../components/InvisibleText'
import CreatureContextProvider from '../context/CreatureContext'
import CreatureProgrammingInput from '../components/CreatureProgrammingInput'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.onCreatureExit = this.onCreatureExit.bind(this)
    this.acquireCreature = this.acquireCreature.bind(this)
    this.onReceivedGardenInfo = this.onReceivedGardenInfo.bind(this)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.centralizedPhaseStartAnimation = this.centralizedPhaseStartAnimation.bind(this)
    this.onInitializeSound = this.onInitializeSound.bind(this)
    this.onCentralizedAnimationEnd = this.onCentralizedAnimationEnd.bind(this)
    this.onCreatureMessage = this.onCreatureMessage.bind(this)
    this.updateCreatureMessages = this.updateCreatureMessages.bind(this)

    this.state = {
      creatures: {},
      creatureMessages: {},
      gardenConfig: {},
      centralizedPhaseIsPlaying: false,
      centralizedPhasePlayOffset: 0,
      soundInitialized: false,
      soundState: SOUND_STATES.CENTRALIZED_PAUSED
    }
  }

  onInitializeSound() {
    this.setState({
      soundInitialized: true
    })
  }

  get isVisible() {
    return (document.visibilityState == 'visible')
  }

  onVisibilityChange() {
    if (this.isVisible) {
      this.socketSetup()
    } else {
      this.socketTeardown()
    }
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
    document.body.addEventListener('touchmove', function(event) { event.preventDefault();});
    document.body.classList.add('pos-fixed')
    this.socketSetup()
  }

  componentWillUnmount() {
    this.socketTeardown()
    document.removeEventListener('visibilitychange')
  }

  socketSetup() {
    Howler.mute(false)
    if (!this.socket) {
      this.socket = io();
      this.socket.on('centralizedPhaseStartAnimation', this.centralizedPhaseStartAnimation)
      this.socket.on('gardenInfo', this.onReceivedGardenInfo)
      this.socket.on('acquireCreature', this.acquireCreature)
      this.socket.on('updateCreatureMessages', this.updateCreatureMessages)
      this.heartbeatInterval = setInterval(() => {
        if (!this.socket) return
        // if (document.hasFocus())
        this.socket.emit('heartbeat')
      }, 3000)
    }
  }

  socketTeardown() {
    Howler.mute(true)
    this.setState({ creatures: {} })
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
  }

  onReceivedGardenInfo({ localGarden, remoteGardens, performancePhase, centralizedPhaseData }) {
    let soundState
    if (performancePhase == PERFORMANCE_PHASES.CENTRALIZED) {
      soundState = centralizedPhaseData.isPlaying ? SOUND_STATES.CENTRALIZED_PLAYING : SOUND_STATES.CENTRALIZED_PAUSED
    } else if (performancePhase == PERFORMANCE_PHASES.DECENTRALIZED) {
      soundState = SOUND_STATES.DECENTRALIZED_NO_CREATURE
    } else if (performancePhase == PERFORMANCE_PHASES.DISTRIBUTED) {
      soundState = SOUND_STATES.DISTRIBUTED_NO_CREATURE
    }

    this.setState({
      gardenConfig: { localGarden, remoteGardens, performancePhase },
      centralizedPhaseIsPlaying: centralizedPhaseData.isPlaying,
      centralizedPhasePlayOffset: centralizedPhaseData.timeOffsetMs,
      soundState
    })
  }

  centralizedPhaseStartAnimation() {
    this.setState({
      centralizedPhaseIsPlaying: true,
      soundState: SOUND_STATES.CENTRALIZED_PLAYING
    })
  }

  onCentralizedAnimationEnd() {
    this.setState({
      soundState: SOUND_STATES.CENTRALIZED_PAUSED
    })
  }

  acquireCreature({ creatureId, messages }) {
    console.log('acquireCreature: ', creatureId, messages)
    const { creatures, creatureMessages } = this.state
    const newCreatures = {
      ...creatures,
      [creatureId]: true
    }
    const newCreatureMessages = {
      ...creatureMessages,
      [creatureId]: messages
    }
    this.setState({
      creatures: newCreatures,
      creatureMessages: newCreatureMessages
    })
  }

  updateCreatureMessages({ creatureId, messages }) {
    console.log('updateCreatureMessages: ', creatureId, messages)
    const { creatureMessages } = this.state
    const newCreatureMessages = {
      ...creatureMessages,
      [creatureId]: messages
    }
    this.setState({
      creatureMessages: newCreatureMessages
    })
  }

  onCreatureMessage(creatureId, message) {
    console.log('onCreatureMessage: ', creatureId, message)
    this.socket.emit('creatureMessage', { creatureId, message })
  }

  onCreatureExit(creatureId, nextGarden) {
    const { creatures } = this.state
    this.setState({
      creatures: {
        ...creatures,
        [creatureId]: false
      }
    })

    if (this.socket) {
      this.socket.emit('creatureExit', { creatureId, nextGarden })
    }
  }

  render() {
    const { creatures, creatureMessages, gardenConfig, centralizedPhaseIsPlaying, centralizedPhasePlayOffset } = this.state
    const { soundInitialized, soundState } = this.state

    const gardenName = gardenConfig.localGarden ? gardenConfig.localGarden.name : ''
    const backgroundClass = classnames({
      "garden-info": true,
      [gardenName]: true
    })

    return (
      <CreatureContextProvider>

        <div onClick={this.onInitializeSound}>
          <Head/>

          <InvisibleText performancePhase={gardenConfig.performancePhase}/>

          { gardenConfig.localGarden &&
            <div className={backgroundClass}>
              <div className="status-info">
                Garden: {gardenName}
                <br/>
                Phase: { gardenConfig.performancePhase }
                <br/>
                Sound state: { soundState }
              </div>
            </div>
          }

          <SoundController
            initialized={soundInitialized}
            soundState={soundState}
          />

          {
            gardenConfig.performancePhase == PERFORMANCE_PHASES.CENTRALIZED &&
            <div key={'CENTRALIZED_DIV'}>
              <CentralizedAnimation
                playing={centralizedPhaseIsPlaying}
                timeOffset={centralizedPhasePlayOffset}
                onAnimationEnd={this.onCentralizedAnimationEnd}
              />
            </div>
          }

          {
            (gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED ||
              gardenConfig.performancePhase == PERFORMANCE_PHASES.DISTRIBUTED) &&
            <div>
              <GardenAnimation gardenConfig={gardenConfig}/>
            </div>
          }

          { (gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED ||
            gardenConfig.performancePhase == PERFORMANCE_PHASES.DISTRIBUTED) &&
            Object.keys(creatures).map((creatureId, index) => {
              return <Creature
                key={creatureId}
                creatureId={creatureId}
                messages={creatureMessages[creatureId]}
                isActive={creatures[creatureId]}
                onExit={this.onCreatureExit}
                gardenConfig={gardenConfig}
              />
            })
          }

          <CreatureProgrammingInput
            onMessage={this.onCreatureMessage}
          />
        </div>

      </CreatureContextProvider>
    )
  }
}
