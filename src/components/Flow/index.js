import { h, cloneElement } from 'preact'
import { createPortal, PureComponent } from 'preact-compat'
import createContext from 'preact-context'
import createHistory from 'history/createBrowserHistory'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import { withNodeContext, withFlowContext, FlowContextProvider } from './context'
import { compose } from '../utils/func'

export { withFlowContext } from './context'
export { default as Node } from './Node'
export { default as Root } from './Root'

class Flow extends PureComponent {
  state = {
    current: 0,
  }

  pathnames = () => this.props.children.map(child => child.props.pathname)

  fullPathnameAt = index => {
    const { parentPathname } = this.props
    return ensureSingleSlash(`${ parentPathname }${ prependSlash(this.pathnames()[index]) }`)
  }

  next = () => {
    const { children, next, history } = this.props
    const nextIndex = this.state.current + 1
    if (nextIndex < children.length) {
      history.push('', { pathname: this.fullPathnameAt(nextIndex) })
    } else {
      next()
    }
  }

  prev = () => history.goBack()

  render() {
    const { next, prev } = this
    const { current, matchedPathname } = this.state
    const { history } = this.props
    return (
      <FlowContextProvider {...{ prev, next, history }}>
        {this.props.children[current]}
      </FlowContextProvider>
    )
  }
}

export default compose(
  withNodeContext,
  withFlowContext
)(Flow)
