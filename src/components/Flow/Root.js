import { h, Component, cloneElement } from 'preact'
import { FlowContextProvider, NodeContextProvider } from './context'

const history = createHistory()
history.replace('/')

export default class Root extends Component {
  state = {
    hasPortalMounted: false,
  }

  handlePortalMounted = () => {
    if (!this.state.hasPortalMounted) {
      this.setState({ hasPortalMounted: true })
    }
  }

  render() {
    const { children, name = 'steps', onEnd, history } = this.props
    const { hasPortalMounted } = this.state

    return (
      <NodeContextProvider>
        {
          hasPortalMounted ? 
            <FlowContextProvider next={onEnd} history={history}>
              {children}
            </FlowContextProvider> :
            null
        }
        <div ref={ this.handlePortalMounted } id={name} />
      </NodeContextProvider>
    )
  }
}