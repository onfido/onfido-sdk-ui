import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import createHistory from 'history/createBrowserHistory'
import { FlowContextProvider, NodeContextProvider } from './context'

const history = createHistory()
history.replace('/')

export default class Root extends PureComponent {
  state = {
    hasPortalMounted: false,
  }

  handleMounted = () => {
    this.setState({ hasPortalMounted: true })
  }

  render() {
    const { children, name = 'steps', onComplete = () => {} } = this.props

    return (
      <div>
        <div id={name} ref={ this.handleMounted } />
        {
          this.state.hasPortalMounted ?
            <FlowContextProvider next={onComplete} history={history} portal={name}>
              {children}
            </FlowContextProvider> :
            null
        }
      </div>
    )
  }
}