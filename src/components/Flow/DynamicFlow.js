import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { withFlowContext, FlowContextProvider } from './context'
import { preventDefaultOnClick } from '../utils'

class DynamicFlow extends PureComponent {
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
    const { children, renderButton, nextStep, history, portal } = this.props

    return hasEntered ?
      <FlowContextProvider {...{prevStep: this.exit, nextStep, history, portal }}>
        {children}
      </FlowContextProvider> :
      renderButton(preventDefaultOnClick(this.enter))
  }
}

export default withFlowContext(DynamicFlow)