import React from 'react'
import { parseRawCommand } from '../modules/CommandProcessor'

const CreatureContext = React.createContext()

export default class CreatureContextProvider extends React.Component {
  state = {
    programmingInterfaceOpen: false,
    programmingInterfaceLastCommand: '',
    programmedCreatureId: null,

    action: this
  }

  toggleProgrammingInterface = (creatureId) => {
    const { programmedCreatureId, programmingInterfaceOpen } = this.state
    if (creatureId == programmedCreatureId) {
      this.setState({ programmingInterfaceOpen: !programmingInterfaceOpen })
    } else {
      this.setState({
        programmingInterfaceOpen: true,
        programmedCreatureId: creatureId
      })
    }
  }

  programmingInterfaceSubmitCommand = (command) => {
    if (!this.state.programmingInterfaceOpen) return
    const processedCommand = parseRawCommand(command)
    this.setState({ programmingInterfaceLastCommand: processedCommand })
  }

  render() {
    const context = { ...this.state }
    const { children } = this.props

    console.log('Context re-render: ', context)

    return (
      <CreatureContext.Provider value={context}>
        { children }
      </CreatureContext.Provider>
    )
  }
}

CreatureContextProvider.defaultProps = {
}

export const withCreatureContext = (mapping) => Component => props => {
  return (
    <CreatureContext.Consumer>
      {(context) => <Component {...props} {...mapping(context, props)}/>}
    </CreatureContext.Consumer>
  )
}
