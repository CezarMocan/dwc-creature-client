import React from 'react'
import Link from 'next/link'
import Style from '../static/styles/main.less'
import Head from '../components/Head'
import Creature from '../components/Creature'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.onCreatureExit = this.onCreatureExit.bind(this)
    this.state = {
      isActive: false
    }
  }
  onCreatureExit() {
    console.log('Exited')
    this.setState({ isActive: false })
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isActive: true })
    }, 2000)
  }
  render() {
    const { isActive } = this.state
    return (
      <div>
        <Head/>
        <Creature isActive={isActive} onExit={this.onCreatureExit}/>
      </div>
    )
  }
}
