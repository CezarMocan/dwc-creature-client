import React from 'react'
import classnames from 'classnames'
import { withCreatureContext } from '../context/CreatureContext'

class CreatureProgrammingInput extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { programmingInterfaceOpen } = this.props

    console.log('CreatureProgrammingInput re-render: ', programmingInterfaceOpen)

    if (!programmingInterfaceOpen) return null

    return (
      <div className="creature-code-input">

      </div>
    )
  }
}

export default withCreatureContext((context, props) => ({
  programmingInterfaceOpen: context.programmingInterfaceOpen,
  programmedCreatureId: context.programmedCreatureId
}))(CreatureProgrammingInput)