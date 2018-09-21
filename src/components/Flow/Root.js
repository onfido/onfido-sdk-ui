import { h, Component, cloneElement } from 'preact'
import { FlowContextProvider, NodeContextProvider } from './context'

export default class Root extends Component {
  state = {
    hasPortal: false,
  }

  handlePortalMounted = () => {
    if (!this.state.hasPortal) {
      this.setState({ hasPortal: true })
    }
  }

  render() {
    const { children, name, onEnd } = this.props
    return (
      <NodeContextProvider base="/">
        <FlowContextProvider next={onEnd}>
          {children}
        </FlowContextProvider>
      </NodeContextProvider>
    )
  }
}