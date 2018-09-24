import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { withFlowContext, FlowContextProvider } from './context'

export default class DynamicFlow extends PureComponent {
  state = {
    hasEntered: false,
  }

  exit = () => {
    this.setState({ hasEntered: false })
  }

  enter = () => {
    this.setState({ hasEntered: true })
  }

  render() {
    const { hasEntered } = this.state
    const { children, renderButton } = this.props
    return hasEntered ?
      <FlowContextProvider {...{prev: this.exit, next: this.enter}}>
        {children}
      </FlowContextProvider> :
      { renderButton() }
  }
}
