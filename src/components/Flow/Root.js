import { h, Component, cloneElement } from 'preact'
import createHistory from 'history/createBrowserHistory'
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
    const { children, name = 'steps', onComplete } = this.props
    const { hasPortalMounted } = this.state

    return (
      <NodeContextProvider>
        {
          hasPortalMounted ? 
            <FlowContextProvider next={onComplete} history={history}>
              {children}
            </FlowContextProvider> :
            null
        }
        <div ref={ this.handlePortalMounted } id={name} />
      </NodeContextProvider>
    )
  }
}