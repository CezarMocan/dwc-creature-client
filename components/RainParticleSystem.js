import React from 'react'
// import Proton from 'proton-js'

export default class RainParticleSystem extends React.Component {
  constructor(props) {
    super(props)
    this.onContainerRef = this.onContainerRef.bind(this)
    this.tick = this.tick.bind(this)
  }

  onContainerRef(e) {
    this._container = e
    this.initializeProton(this._container)
  }

  initializeProton(el) {
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
    this.emitter.p.x = 300;
    this.emitter.p.y = 300;
    this.emitter.emit(50);

    //add emitter to the proton
    this.proton.addEmitter(this.emitter);

    // add canvas renderer
    var renderer = new Proton.DomRenderer(el);
    this.proton.addRenderer(renderer);

    console.log(this.proton)

    this.tick()

    //use Euler integration calculation is more accurate (default false)
    // Proton.USE_CLOCK = false or true;
  }

  tick() {
    if (this.proton) {
      this.proton.update()
      this.emitter.p.x = 300 + (Math.random() - 0.5) * 20
    }
    this._rafId = requestAnimationFrame(this.tick)
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this._proton = null
    if (this._rafId)
      cancelAnimationFrame(this._rafId)
  }

  render() {
    return (
      <div className="rain-particle-system" ref={this.onContainerRef}>

      </div>
    )
  }
}