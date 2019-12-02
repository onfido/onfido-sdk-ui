// @flow
import * as React from 'react'
import { h, Component } from 'preact'

type State = {
  disabled: boolean,
}

type Props = {
  disabled: ?boolean,
  shouldBeDisabledOnClick: ?boolean,
  onClick: Function,
}

export default (WrappedButton: React.ComponentType<Props>): React.ComponentType<Props> =>
  class WithOnSubmitDisabling extends Component<Props, State> {

  constructor() {
    super()
    this.state = {
      disabled: false
    }
  }

  handleClick = () => {
    if (this.props.shouldBeDisabledOnClick) {
      this.setState({ disabled: true })
      return this.props.onClick()
    }
    if (this.props.onClick) { this.props.onClick() }
  }

  render = () => {
    return <WrappedButton disabled={this.props.disabled || this.state.disabled} onBtnClick={this.handleClick} {...this.props} />
  }
}
