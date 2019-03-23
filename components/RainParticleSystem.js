import React from 'react'
// import Proton from 'proton-js'

const DURATION = 10

export default class RainParticleSystem extends React.Component {
  constructor(props) {
    super(props)
    this.onContainerRef = this.onContainerRef.bind(this)
    this.tick = this.tick.bind(this)
  }

  onContainerRef(e) {
    if (this._container) return
    this._container = e
    this.initializeProton(this._container)
  }

  initializeProton(el, x = 0, y = 0, duration = 10) {
    const Proton = require('proton-js')
    this.proton = new Proton()
    this.emitter = new Proton.Emitter()

    //set Rate
    this.emitter.rate = new Proton.Rate(Proton.getSpan(1, 1), 0.1);

    //add Initialize
    this.emitter.addInitialize(new Proton.Radius(5, 12));
    this.emitter.addInitialize(new Proton.Life(2, 2));
    this.emitter.addInitialize(new Proton.Velocity(0.75, Proton.getSpan(155, 215), 'polar'));
    // this.emitter.addInitialize(new Proton.Mass(200))

    //add Behaviour
    this.emitter.addInitialize(new Proton.Body(
      ['static/images/decentralized/rain/1.png', 'static/images/decentralized/rain/2.png', 'static/images/decentralized/rain/3.png'],
      15,
      15
    ))

    // this.emitter.addBehaviour(new Proton.Alpha(1, 0));
    this.emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(0, 1), 'add'));
    this.emitter.addBehaviour(new Proton.Gravity(0.5));
    this.emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.4, 0.5), Proton.getSpan(0.4, 0.5)));
    // this.emitter.addBehaviour(new Proton.Color('random'));
    // this.emitter.addBehaviour(new Proton.Alpha(1, 0));

    //set emitter position
    // this.emitter.p.x = x;
    // this.emitter.p.y = y;
    // this.emitter.emit(duration);

    //add emitter to the proton
    this.proton.addEmitter(this.emitter);

    // add canvas renderer
    var renderer = new Proton.DomRenderer(el);
    this.proton.addRenderer(renderer);

    // console.log(this.proton)

    // this.tick()

    //use Euler integration calculation is more accurate (default false)
    // Proton.USE_CLOCK = false or true;
  }

  tick() {
    if (this.proton) {
      this.proton.update()
      this.emitter.p.x = this.props.x + (Math.random() - 0.5) * 20
    }
    this._rafId = requestAnimationFrame(this.tick)
  }

  startTick() {
    if (!this.proton || !this.emitter) return
    //set emitter position
    this.emitter.p.x = this.props.x;
    this.emitter.p.y = this.props.y;
    this.emitter.emit(DURATION);
    this.tick()
  }

  cancelTick() {
    if (this._rafId)
      cancelAnimationFrame(this._rafId)
    if (this.emitter)
      this.emitter.stop()
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