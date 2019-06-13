import React from 'react'
import classnames from 'classnames'
import { withCreatureContext } from '../context/CreatureContext'

class CreatureProgrammingInput extends React.Component {
  state = {
    value: ''
  }

  onChange = (evt) => {
    const value = evt.target.value
    this.setState({ value })
  }

  onKeyDown = (evt) => {
    if (evt.keyCode != 13) return
    const { value } = this.state
    const { onMessage, programmedCreatureId } = this.props
    this.setState({ value: '' })
    onMessage(programmedCreatureId, value)
  }

  render() {
    const { programmingInterfaceOpen } = this.props
    const { value } = this.state

    if (!programmingInterfaceOpen) return null

    return (
      <div className="creature-code-input-container">
        <input
          id="programmable-input"
          className="creature-code-input"
          type="text"
          value={value}
          placeholder="Type here..."
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

export default withCreatureContext((context, props) => ({
  programmingInterfaceOpen: context.programmingInterfaceOpen,
  programmedCreatureId: context.programmedCreatureId,
}))(CreatureProgrammingInput)