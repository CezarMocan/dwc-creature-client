import React from 'react'
import Style from '../static/styles/main.less'
import PoemForCreature from '../components/PoemForCreature'
import { CREATURES } from '../constants'

export default class PoemCreature extends React.Component {
  render() {
    return ( 
      <PoemForCreature creatureId={Object.keys(CREATURES)[7]}/>
    )
  }
}