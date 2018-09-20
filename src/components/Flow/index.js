import { h, cloneElement } from 'preact'
import { createPortal, PureComponent } from 'preact-compat'
import { withFlowContext, FlowContextProvider } from './context'
import createHistory from 'history/createBrowserHistory'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
export { withFlowContext } from './context'
export { default as Root } from './Root'

const history = createHistory()
history.replace('/')

class Flow extends PureComponent {
  static defaultProps = {
    base: '/',
  }

  state = {
    current: 0,
  }

  componentDidMount() {
    this.unlisten = history.listen(this.handleHistoryChange)
    this.handleHistoryChange(history.location)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  handleHistoryChange = location => {
    const { base } = this.props
    const { pathname = '' } = location.state || {}
    const matches = !!pathname.match(new RegExp('^' + base + '\/?'))
    if (matches) {
      const [after] = pathname.match(new RegExp('(?<=' + base + '\/?).*'))
      const relevant = stripLeadingSlash(after).split('/')[0]
      const nextIndex = this.pathnames().indexOf(relevant)
      this.setState({ current: nextIndex !== -1 ? nextIndex : 0 })
    }
  }

  pathnames = () => this.props.children.map(child => child.props.path)

  go = nextIndex => {
    const { base } = this.props
    const pathname = ensureSingleSlash(`${ base }${ prependSlash(this.pathnames()[nextIndex]) }`)
    history.push('', { pathname })
  }

  next = () => {
    const { children, next } = this.props
    const updated = this.state.current + 1
    if (updated < children.length) {
      this.go(updated)
    } else {
      next()
    }
  }

  prev = () => history.goBack()

  render() {
    const { next, prev } = this
    const { current } = this.state
    const { children, base, portal } = this.props
    const child = children[current]
    return (
      <FlowContextProvider {...{ base, portal, prev, next }}>
        {child}
      </FlowContextProvider>
    )
  }
}

export default withFlowContext(Flow)

export const Node = withFlowContext(({ path, portal, prev, next, base, children }) =>
  <FlowContextProvider {...{ portal, prev, next,
    base: ensureSingleSlash(`${ base}/${ path}`)
  }}>{
    createPortal(children[0], document.querySelector(`#${portal}`))
  }
  </FlowContextProvider>
)

