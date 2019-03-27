import React from 'react'
// import Proton from 'proton-js'
import {Howl, Howler} from 'howler'

var Proton

const DURATION = 10

export default class RainParticleSystem extends React.Component {
  constructor(props) {
    super(props)
    this.onContainerRef = this.onContainerRef.bind(this)
    this.tick = this.tick.bind(this)
    this.emitters = []

    this.sounds = [
      new Howl({
        src: ['/static/audio/watering.mp3'],
        autoplay: false,
        loop: true
      }),
      new Howl({
        src: ['/static/audio/plantGrow.mp3'],
        autoplay: false,
        loop: true
      }),
    ]
  }

  onContainerRef(e) {
    if (this._container) return
    this._container = e
    this.initializeProton(this._container)
  }

  configureEmitter(emitter) {
    emitter.rate = new Proton.Rate(Proton.getSpan(1, 1), 0.15);

    //add Initialize
    emitter.addInitialize(new Proton.Radius(5, 12));
    emitter.addInitialize(new Proton.Life(1, 1));
    emitter.addInitialize(new Proton.Velocity(1, Proton.getSpan(175, 205), 'polar'));

    //add Behaviour
    emitter.addInitialize(new Proton.Body(
      ['static/images/decentralized/rain/1.png',
       'static/images/decentralized/rain/2.png',
       'static/images/decentralized/rain/3.png',
       'static/images/decentralized/rain/4.png',
       'static/images/decentralized/rain/5.png'
      ],
      15,
      15
    ))

    emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(0, 1), 'add'));
    emitter.addBehaviour(new Proton.Gravity(2.5));
    emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.15, 0.25), Proton.getSpan(0.15, 0.25)));
  }

  initializeProton(el, x = 0, y = 0, duration = 10) {
    if (!Proton) Proton = require('proton-js')
    this.proton = new Proton()
    const noEmitters = 5

    this.emitters = []
    for (let i = 0; i < noEmitters; i++) {
      this.emitters.push(new Proton.Emitter())
    }

    this.emitters.forEach(emitter => {
      this.configureEmitter(emitter)
      this.proton.addEmitter(emitter);
    })

    // add canvas renderer
    this.renderer = new Proton.DomRenderer(el);
    this.proton.addRenderer(this.renderer);
  }

  getRandomSound() {
    if (Math.random() < 0.5)
      return this.sounds[0]
    else
      return this.sounds[1]
  }

  tick() {
    if (this.proton) {
      this.proton.update()
      this.emitters.forEach((emitter, index) => {
        const sgn = (index % 2 == 0) ? -1 : 1
        const amt = sgn * parseInt(Math.floor((index + 1) / 2))
        emitter.p.x = this.props.x + amt * 20
        emitter.p.y = this.props.y + sgn * amt * 20//(sgn + 1) / 2 * 25
      })
    }
    this._rafId = requestAnimationFrame(this.tick)
  }

  startTick() {
    if (!this.proton) {
      this.initializeProton(this._container)
    }
    //set emitter position
    this.emitters.forEach(emitter => {
      emitter.p.x = this.props.x;
      emitter.p.y = this.props.y;
      emitter.emit(DURATION);
    })

    this.currentSound = this.getRandomSound()
    this.currentSound.play()

    if (!this._rafId) this.tick()
  }

  cancelTick() {
    this.emitters.forEach(emitter => emitter.stop())
    if (this.currentSound) this.currentSound.pause()
  }

  componentDidUpdate(oldProps) {
    const { active, x, y } = this.props
    if (active != oldProps.active) {
      if (active) this.startTick()
      else this.cancelTick()
    }
  }

  componentDidMount() {
    const { active } = this.props
    if (active) this.startTick()
  }

  componentWillUnmount() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
    this._proton = null
    this.cancelTick()
  }

  render() {
    return (
      <div className="rain-particle-system" ref={this.onContainerRef}>

      </div>
    )
  }
}

RainParticleSystem.defaultProps = {
  active: false,
  x: 0,
  y: 0
}