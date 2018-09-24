import { h, cloneElement } from 'preact'
import { PureComponent, Children } from 'preact-compat'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import { withNodeContext, withFlowContext, FlowContextProvider } from './context'
import { compose } from '../utils/func'

export { withFlowContext } from './context'
export { default as DynamicFlow } from './DynamicFlow'

class Flow extends PureComponent {
  static defaultProps = {
    parentPathname: '',
  }

  state = {
    current: 0,
  }

  componentDidMount() {
    const { history } = this.props
    this.unlisten = history.listen(this.handleHistoryChange)
    this.handleHistoryChange(history.location)
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten()
  }

  handleHistoryChange = location => {
    const { parentPathname } = this.props
    const { state = {} } = location
    const { pathname = '' } = state
    const matches = pathname.match(new RegExp('^' + parentPathname + '\/?'))
    if (!!matches) {
      // select which child to display
      const [after] = pathname.match(new RegExp('(?<=' + parentPathname + '\/?).*'))
      const relevant = stripLeadingSlash(after).split('/')[0]
      const nextIndex = this.pathnames().indexOf(relevant)
      this.setState({ current: nextIndex !== -1 ? nextIndex : 0 })
    }
  }

  pathnames = () =>
    Children.toArray(this.props.children).map(child => child.props.pathname)

  fullPathnameAt = index => {
    const { parentPathname } = this.props
    return ensureSingleSlash(`${ parentPathname }${ prependSlash(this.pathnames()[index]) }`)
  }

  next = () => {
    const { children, next, history } = this.props
    const nextIndex = this.state.current + 1
    if (nextIndex < children.length) {
      const pathname = this.fullPathnameAt(nextIndex)
      history.push('', { pathname })
    } else {
      next()
    }
  }

  prev = () => this.props.history.goBack()

  render() {
    const { next, prev } = this
    const { current } = this.state
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
