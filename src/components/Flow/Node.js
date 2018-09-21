import { h, Component } from 'preact'
import { createPortal } from 'preact-compat'
import createContext from 'preact-context'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import { withFlowContext, withNodeContext, NodeContextProvider } from './context'

class Node extends Component {

  state = {
    matches: false,
  }

  componentDidMount() {
    const { history } = this.props
    const { state = {} } = history.location
    this.unlisten = history.listen(this.handleHistoryChange)
    this.handleHistoryChange(state.pathname)
  }

  componentWillReceiveProps({ currentPathname }) {
    if (currentPathname !== this.props.currentPathname) {
      this.handleHistoryChange(currentPathname)
    }
  }

  componentWillUnmount() {
    this.unlisten()
  }

  fullPathname = ({ parentPathname, pathname }) =>
    ensureSingleSlash(`${ parentPathname }/${ pathname }`)

  handleHistoryChange = pathname => {
    const matches = !!pathname.match(new RegExp('^' + this.fullPathname() + '\/?'))
    this.setState({ matches })
  }

  render () {
    const { currentPathname, children } = this.props
    const pathname = this.fullPathname()

    return (
      <NodeContextProvider parentPathname={pathname}>
      { children }
      </NodeContextProvider>
    )
  }
}

export default withFlowContext(withNodeContext(Node))
