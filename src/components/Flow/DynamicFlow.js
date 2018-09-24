import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { withFlowContext, withNodeContext, FlowContextProvider } from './context'
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
    const { children, renderButton, next, history } = this.props

    return hasEntered ?
      <FlowContextProvider {...{prev: this.exit, next, history}}>
        {children}
      </FlowContextProvider> :
      renderButton(preventDefaultOnClick(this.enter))
  }
}

export default withNodeContext(withFlowContext(DynamicFlow))