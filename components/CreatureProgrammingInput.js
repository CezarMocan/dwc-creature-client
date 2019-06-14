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
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) this.inputElement.blur()
    onMessage(programmedCreatureId, value)
  }

  componentDidUpdate(oldProps) {
    if (this.props.programmingInterfaceOpen && !oldProps.programmingInterfaceOpen) {
      // if (this.inputElement) this.inputElement.focus()
    }
  }

  render() {
    const { programmingInterfaceOpen } = this.props
    const { value } = this.state

    if (!programmingInterfaceOpen) return null

    return (
      <div className="creature-code-input-container">
        <input
          id="programmable-input"
          ref={(e) => this.inputElement = e}
          className="creature-code-input"
          type="text"
          value={value}
          placeholder="Type here..."
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          autoComplete="false"
        />
      </div>
    )
  }
}

export default withCreatureContext((context, props) => ({
  programmingInterfaceOpen: context.programmingInterfaceOpen,
  programmedCreatureId: context.programmedCreatureId,
}))(CreatureProgrammingInput)