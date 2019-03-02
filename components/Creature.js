import React from 'react'
import Head from 'next/head'

export default class CreatureComponent extends React.Component {
  constructor(props) {
    super(props)
    this.onRef = this.onRef.bind(this)
    this.update = this.update.bind(this)

    this.anim = {
      x: 0,
      y: 0,
      rotation: 0
    }
  }

  onRef(e) {
    this._e = e
    const { isActive } = this.props
    if (isActive) this.update()
  }

  outOfBounds() {
    if (this.anim.x < 0) return true
    if (this.anim.y < 0) return true
    if (this.anim.x > window.innerWidth) return true
    if (this.anim.y > window.innerHeight) return true
    return false
  }

  updateCreaturePosition() {
    if (!this._e) return
    this.anim.x += 2
    this.anim.rotation += 1

    this._e.style.transform = `translateX(${this.anim.x}px) translateY(${this.anim.y}px) rotate(${this.anim.rotation}deg)`
  }

  update() {
    const { isActive } = this.props
    if (!isActive) return

    this.updateCreaturePosition()

    if (this.outOfBounds()) {
      this.props.onExit()
    } else {
      requestAnimationFrame(this.update)
    }
  }

  componentDidUpdate(oldProps) {
    const { isActive } = this.props
    if (isActive && !oldProps.isActive) {
      this.update()
    } else if (!isActive && oldProps.isActive) {
      
    }
  }

  render() {
    const { isActive } = this.props
    return (
      <div className={`creature ${isActive ? '' : 'hidden'}`} ref={(e) => {this.onRef(e)}}></div>
    )
  }
}

CreatureComponent.defaultProps = {
  onExit: () => {},
  isActive: false
}