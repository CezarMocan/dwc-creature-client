import React from 'react'
import RainParticleSystem from './RainParticleSystem'

export default class DecentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="decentralized-animation">
        <RainParticleSystem/>
      </div>
    )
  }
}