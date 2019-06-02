import React from 'react'
import RainParticleSystem from './RainParticleSystem'
import Plant from './Plant'
import { PERFORMANCE_PHASES } from '../constants'
import { unzipImagesFromArchive } from '../utils/zip'

const NO_FRAMES = [-1, 100, 100, 60, 80, 80, 40, 50]

const POSITIONS = [
  { xPct: 20, yPct: 20, radius: 15 },
  { xPct: 20, yPct: 45, radius: 25 },
  { xPct: 50, yPct: 20, radius: 12 },
  { xPct: 44, yPct: 66, radius: 22 },
  { xPct: 80, yPct: 25, radius: 18 },
  { xPct: 75, yPct: 70, radius: 19 }
]

const PLANTS = NO_FRAMES.reduce((acc, noFrames, index) => {
  if (index == 0) return acc
  const zipPath = `/static/images/decentralized/garden/${index}.zip`
  const frameFilenameFn = (frameIndex) => `${frameIndex}.png`
  // const images = [...Array(noFrames).keys()].map(k => `/static/images/decentralized/garden/${index}/${k}.png`)
  acc[index] = { noFrames, zipPath, frameFilenameFn }
  return acc
}, {})

const getNoGrowthState = () => {
  return Object.keys(PLANTS).reduce((acc, key) => {
    acc[key] = false
    return acc
  }, {})
}

export default class DecentralizedAnimation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      touching: false,
      touchX: 0,
      touchY: 0,
      plantGrowing: {},
      plants: [],
      plantsInfo: {},
      ready: false,
      selectedSeedId: -1,
      selectedSeedOffsetX: 0,
      selectedSeedOffsetY: 0
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.updatePlantGrowth = this.updatePlantGrowth.bind(this)
    this.onSeedTouchStart = this.onSeedTouchStart.bind(this)
    this.onSeedTouchMove = this.onSeedTouchMove.bind(this)
    this.onSeedTouchEnd = this.onSeedTouchEnd.bind(this)
  }

  async generatePlantFrames(plantId) {
    const zipPath = PLANTS[plantId].zipPath
    const noFrames = PLANTS[plantId].noFrames
    const frameFilenameFn = PLANTS[plantId].frameFilenameFn
    const images = await unzipImagesFromArchive(zipPath, noFrames, frameFilenameFn)
    return {
      noFrames,
      images
    }
  }

  async generateAllPlantsFrames() {
    console.log('Generate all frames start')
    this.allPlantsFrames = {}
    for (let i in PLANTS) {
      console.log('i is: ', i)
      // const plantId = Object.keys(PLA)
      this.allPlantsFrames[i] = await this.generatePlantFrames(i)
    }
    console.log('Generate all frames done')
  }

  get isDecentralizedPhase() {
    const { gardenConfig } = this.props
    return gardenConfig.performancePhase == PERFORMANCE_PHASES.DECENTRALIZED
  }

  get plants(){
    return this.state.plants
  }

  rand(a, b) {
    return a + parseInt(Math.floor(Math.random() * (b - a + 1)))
  }

  pickN(n, arr) {
    const picked = {}
    let found = 0
    while (found < n) {
      let index = this.rand(0, arr.length - 1)
      if (!picked[index]) {
        picked[index] = true
        found++
      }
    }

    return Object.keys(picked).map(k => arr[k])
  }

  generateLayout() {
    return

    let plants, positions

    // if (true) {
    if (!localStorage.getItem('plants') || !localStorage.getItem('positions')) {
      const noPlants = this.rand(3, 5)
      plants = this.pickN(noPlants, Object.keys(PLANTS))
      positions = this.pickN(noPlants, POSITIONS)

      localStorage.setItem('plants', JSON.stringify(plants))
      localStorage.setItem('positions', JSON.stringify(positions))
    } else {
      plants = JSON.parse(localStorage.getItem('plants'))
      positions = JSON.parse(localStorage.getItem('positions'))
    }

    let plantsInfo = {}
    for (let index = 0; index < plants.length; index++) {
      const plantId = plants[index]
      plantsInfo[index] = { ...this.allPlantsFrames[plantId], ...positions[index] }
    }

    this.setState({ plants, plantsInfo })
  }

  touchInRadius(x, y, pX, pY, pR) {
    // Move plant center higher up, so we can rain more above
    const nX = x
    const nY = y + pR * 0.75

    const dX = nX - pX
    const dY = nY - pY
    if (dX * dX + dY * dY <= pR * pR) return true
    return false
  }

  updatePlantGrowth() {
    const { touching, touchX, touchY, plantsInfo } = this.state
    const plantGrowing = {}//getNoGrowthState()

    if (touching) {
      const touchXPct = touchX / window.innerWidth * 100
      const touchYPct = touchY / window.innerHeight * 100

      this.plants.forEach((key, index) => {
        const p = plantsInfo[index]
        if (this.touchInRadius(touchXPct, touchYPct, p.xPct, p.yPct, p.radius))
          plantGrowing[index] = true
      })
    }

    this.setState({ plantGrowing })
  }

  onTouchStart(e) {
    if (!this.isDecentralizedPhase) return

    let touch
    if (e.type == 'touchstart') {
      touch = e.touches[0] || e.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touching: true,
      touchX: touch.pageX,
      touchY: touch.pageY
    }, () => {
      this.updatePlantGrowth()
    })
  }

  onTouchMove(e) {
    if (!this.isDecentralizedPhase) return

    const { touching } = this.state
    if (!touching) return

    let touch
    if (e.type == 'touchmove') {
      touch = e.touches[0] || e.changedTouches[0];
    } else {
      touch = e
    }

    this.setState({
      touchX: touch.pageX,
      touchY: touch.pageY
    }, () => {
      this.updatePlantGrowth()
    })
  }

  onTouchEnd(e) {
    if (!this.isDecentralizedPhase) return

    this.setState({ touching: false }, () => {
      this.updatePlantGrowth()
    })
  }

  async componentDidMount() {
    await this.generateAllPlantsFrames()
    this.generateLayout()
    this.setState({ ready: true })
  }

  onSeedTouchStart(evt, plantId) {
    evt.stopPropagation()

    // If we've already selected another plant, do nothing
    const { selectedSeedId } = this.state
    if (selectedSeedId != -1) return

    // Update previous position
    this.seedTouch = { x: evt.clientX, y: evt.clientY }
    this.setState({ selectedSeedId: plantId })
  }

  onSeedTouchMove(evt, plantId) {
    evt.stopPropagation()

    // If we've already selected another plant, do nothing
    const { selectedSeedId } = this.state
    if (selectedSeedId != plantId) return

    const d = { x: evt.clientX - this.seedTouch.x, y: evt.clientY - this.seedTouch.y }
    this.seedTouch = { x: evt.clientX, y: evt.clientY }

    const { selectedSeedOffsetX, selectedSeedOffsetY } = this.state

    this.setState({
      selectedSeedOffsetX: selectedSeedOffsetX + d.x,
      selectedSeedOffsetY: selectedSeedOffsetY + d.y
    })
  }

  onSeedTouchEnd(evt, plantId) {
    evt.stopPropagation()

    // If we've already selected another plant, do nothing
    const { selectedSeedId } = this.state
    if (selectedSeedId != plantId) return

    const xPct = evt.clientX / window.innerWidth * 100
    const yPct = evt.clientY / window.innerHeight * 100
    const radius = 10

    this.addPlant(plantId, xPct, yPct, radius)

    this.setState({
      selectedSeedId: -1,
      selectedSeedOffsetX: 0,
      selectedSeedOffsetY: 0,
    })
  }

  addPlant(plantId, xPct, yPct, radius) {
    const { plants, plantsInfo } = this.state

    const index = plants.length
    const newPlants = [...plants, plantId]//plants.slice(0).push(plantId)
    const newPlantsInfo = {
      ...plantsInfo,
      [index]: { ...this.allPlantsFrames[plantId], xPct, yPct, radius }
    }
    // newPlantsInfo[index] = { ...this.allPlantsFrames[plantId], xPct, yPct, radius }

    console.log('addPlant: ', plants, newPlants, plantsInfo, newPlantsInfo)

    this.setState({ plants: newPlants, plantsInfo: newPlantsInfo })
  }

  render() {
    const { touching, touchX, touchY, plantGrowing, plantsInfo, ready } = this.state
    const { selectedSeedId, selectedSeedOffsetX, selectedSeedOffsetY } = this.state

    if (!ready) return null

    return (
      <div className="decentralized-animation"
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        onMouseDown={this.onTouchStart}
        onMouseMove={this.onTouchMove}
        onMouseUp={this.onTouchEnd}
      >
        { this.plants.map((k, index) => {
          return (<Plant
            key={`plant-${index}`}
            obj={plantsInfo[index]}
            plantId={k}
            growing={plantGrowing[index] || !this.isDecentralizedPhase}
            xPct={plantsInfo[index].xPct}
            yPct={plantsInfo[index].yPct}
            widthPct={2 * plantsInfo[index].radius}/>)
        })}
        { this.isDecentralizedPhase &&
          <RainParticleSystem active={touching} x={touchX} y={touchY}/>
        }
        {
          this.isDecentralizedPhase &&
          <div className="seeds-collection">
            { Object.keys(PLANTS).map(id => {
              const offsetX = selectedSeedId == id ? selectedSeedOffsetX : 0
              const offsetY = selectedSeedId == id ? selectedSeedOffsetY : 0
              return (
                <Plant
                  key={`seed-plant-${id}`}
                  obj={this.allPlantsFrames[id]}
                  plantId={id}
                  growing={false}
                  xPct={100 / 8 * id}
                  yPct={50}
                  widthPct={10}
                  xOffsetPx={offsetX}
                  yOffsetPx={offsetY}
                  draggable={true}
                  onTouchStart={this.onSeedTouchStart}
                  onTouchMove={this.onSeedTouchMove}
                  onTouchEnd={this.onSeedTouchEnd}
                  showGrown={true}
                />
              )
            })}
          </div>
        }
      </div>
    )
  }
}