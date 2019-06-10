import React from 'react'
import { CREATURES } from '../constants'
import PNGSequencePlayer from '../components/PNGSequencePlayer'
import { getPromise } from '../utils/xhr'

const NO_LOOPING_FRAMES = 6

export default class PoemCreature extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }
  async componentDidMount() {
    const { creatureId } = this.props
    // const creatureId = 'creature1'

    const allMessages = await getPromise('/savedMessages')
    console.log('allMessages: ', allMessages)
    console.log('curr: ', allMessages[creatureId])
    this.setState({ messages: allMessages[creatureId] })
  }
  render() {
    const { messages } = this.state    
    const { creatureId } = this.props
    const framesFolder = CREATURES[creatureId].folder

    return (
      <div className="poem-container">
        <div className="poem-creature-container">
          <PNGSequencePlayer
            loopImages={[...Array(NO_LOOPING_FRAMES).keys()].map(k => `/static/images/creatures/${framesFolder}/${k}.png`)}
            isPlaying={true}
            loop={true}
            imageClassName="reversed-x"
            inViewport={true}
            withPreload={true}
          />
        </div>

        <div className="poem-content-container">
          { messages && messages.map((m, index) => {
            if (m.message == "") return (<br key={`poem-line-${index}`}/>)
            return (<h1 key={`poem-line-${index}`} className="poem-line"> {m.message} </h1>)
          })}
        </div>
      </div>
    )
  }
}