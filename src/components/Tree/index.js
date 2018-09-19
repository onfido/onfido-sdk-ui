import { h, Component, cloneElement } from 'preact'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import createHistory from 'history/createBrowserHistory'
import { withTreeContext, TreeContextProvider } from './context'
export { withTreeContext, TreeContextProvider } from './context'
export { default as Leaf } from './Leaf'

const history = createHistory()
history.replace('/')

const unchanged = `${location.pathname}${location.search}${location.hash}`

class Tree extends Component {
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

  handleHistoryChange = (location) => {
    const { base } = this.props
    const { pathname = '' } = location.state || {}
    const matches = !!pathname.match(new RegExp('^' + base + '\/?'))
    if (matches) {
      const [after] = pathname.match(new RegExp('(?<=' + base + '\/?).*'))
      const path = stripLeadingSlash(after).split('/')[0]
      const index = this.paths().indexOf(path)
      const next = index !== -1 ? index : 0
      this.setState({ current: next })
    }
  }

  go = next => {
    const { base } = this.props
    const pathname = ensureSingleSlash(`${ base }${ prependSlash(this.paths()[next]) }`)
    history.push('', { pathname })
  }

  paths = () => this.props.children.map(child => child.props.path)

  next = () => {
    const { children } = this.props
    const updated = this.state.current + 1
    if (updated < children.length) {
      this.go(updated)
    } else {
      this.props.next()
    }
  }

  prev = () => history.goBack()

  render() {
    const { next, prev } = this
    const { current } = this.state
    const { children, base } = this.props
    const child = children[current]
    return (
      <TreeContextProvider {...{ base, prev, next }}>
        {child}
      </TreeContextProvider>
    )
  }
}


export default withTreeContext(Tree)