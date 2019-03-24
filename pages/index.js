import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'
import Creature from '../components/Creature'
import { PERFORMANCE_PHASES } from '../constants'
import CentralizedAnimation from '../components/CentralizedAnimation'
import DecentralizedAnimation from '../components/DecentralizedAnimation'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.onCreatureExit = this.onCreatureExit.bind(this)
    this.acquireCreature = this.acquireCreature.bind(this)
    this.onReceivedGardenInfo = this.onReceivedGardenInfo.bind(this)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.centralizedPhaseStartAnimation = this.centralizedPhaseStartAnimation.bind(this)

    this.state = {
      creatures: {},
      gardenConfig: {},
      centralizedPhaseIsPlaying: false
    }
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

  onWakeUp() {
    this.socketSetup()
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
    this.socketSetup()
  }

  componentWillUnmount() {
    this.socketTeardown()
    document.removeEventListener('visibilitychange')
  }

  socketSetup() {
    if (!this.socket) {
      this.socket = io();
      this.socket.on('centralizedPhaseStartAnimation', this.centralizedPhaseStartAnimation)
      this.socket.on('gardenInfo', this.onReceivedGardenInfo)
      this.socket.on('acquireCreature', this.acquireCreature)
      this.heartbeatInterval = setInterval(() => {
        if (!this.socket) return
        // if (document.hasFocus())
        this.socket.emit('heartbeat')
      }, 3000)
    }
  }

  socketTeardown() {
    this.setState({ creatures: {} })
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
  }

  onReceivedGardenInfo({ localGarden, remoteGardens, performancePhase }) {
    console.log('Performance phase is: ', performancePhase)
    this.setState({
      gardenConfig: { localGarden, remoteGardens, performancePhase },
      centralizedPhaseIsPlaying: false
    })
  }

  centralizedPhaseStartAnimation() {
    this.setState({ centralizedPhaseIsPlaying: true })
  }

  acquireCreature({ creatureId }) {
    console.log('acquireCreature: ', creatureId)
    const { creatures } = this.state
    this.setState({
      creatures: {
        ...creatures,
        [creatureId]: true
      }
    })
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
    const { creatures, gardenConfig, centralizedPhaseIsPlaying } = this.state
    const gardenName = gardenConfig.localGarden ? gardenConfig.localGarden.name : ''
    const backgroundClass = classnames({
      "garden-info": true,
      [gardenName]: true
    })

    return (
      <div>
        <Head/>
        { gardenConfig.localGarden &&
          <div className={backgroundClass}>
            <div className="status-info">
              Garden: {gardenName}
              <br/>
              Phase: { gardenConfig.performancePhase }
            </div>
          </div>
        }

        {
          gardenConfig.performancePhase == PERFORMANCE_PHASES.CENTRALIZED &&
          <div>
            <CentralizedAnimation playing={centralizedPhaseIsPlaying}/>
          </div>
        }

        {
          gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED &&
          <div>
            <DecentralizedAnimation gardenConfig={gardenConfig}/>
          </div>
        }

        { (gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED ||
          gardenConfig.performancePhase == PERFORMANCE_PHASES.DISTRIBUTED) &&
          Object.keys(creatures).map((creatureId, index) => {
            return <Creature
              key={creatureId}
              creatureId={creatureId}
              isActive={creatures[creatureId]}
              onExit={this.onCreatureExit}
              gardenConfig={gardenConfig}
            />
          })
        }
      </div>
    )
  }
}
