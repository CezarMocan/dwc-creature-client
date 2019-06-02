import React from 'react'

const CreatureContext = React.createContext()

export default class CreatureContextProvider extends React.Component {
  state = {
    programmingInterfaceOpen: false,
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
