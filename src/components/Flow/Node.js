import { h, Component } from 'preact'
import { createPortal } from 'preact-compat'
import createContext from 'preact-context'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import { withNodeContext, NodeContextProvider } from './context'

class Node extends Component {
  static defaultProps = {
    parentPathname: '',
  }

  state = {
    matches: false,
  }

  fullPathname = () => {
    const { parentPathname, pathname } = this.props
    return ensureSingleSlash(`${ parentPathname }/${ pathname }`)
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

export default withNodeContext(Node)
