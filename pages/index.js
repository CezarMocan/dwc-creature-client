import React from 'react'
import Link from 'next/link'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'
import Creature from '../components/Creature'
import server from '../config/server'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.onCreatureExit = this.onCreatureExit.bind(this)
    this.acquireCreature = this.acquireCreature.bind(this)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)

    this.state = {
      isActive: false
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
    this.socketSetup()
  }

  componentWillUnmount() {
    this.socketTeardown()
    document.removeEventListener('visibilitychange')
  }

  socketSetup() {
    if (!this.socket) {
      this.socket = io(server.address);
      this.socket.on('acquireCreature', this.acquireCreature)
      this.heartbeatInterval = setInterval(() => {
        if (!this.socket) return
        this.socket.emit('heartbeat')
      }, 3000)
    }
  }

  socketTeardown() {
    this.setState({ isActive: false })
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
  }

  acquireCreature(position) {
    console.log('acquireCreature: ', position)
    this.setState({ isActive: true, position: position })
  }

  onCreatureExit() {
    console.log('Exited')
    this.setState({ isActive: false })

    if (this.socket) {
      this.socket.emit('creatureExit', { x: 1, y: 0.5 })
    }
  }

  render() {
    const { isActive, position } = this.state
    return (
      <div>
        <Head/>
        <Creature isActive={isActive} position={position} onExit={this.onCreatureExit}/>
      </div>
    )
  }
}
