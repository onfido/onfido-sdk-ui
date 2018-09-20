import { h, Component, cloneElement } from 'preact'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import createHistory from 'history/createBrowserHistory'
import { withStepsContext, StepsContextProvider } from './context'
export { withStepsContext, StepsContextProvider } from './context'
export { default as Step } from './Step'

const history = createHistory()
history.replace('/')

class Steps extends Component {
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
    const { children, base, portal } = this.props
    const child = children[current]
    return (
      <StepsContextProvider {...{ base, portal, prev, next }}>
        {child}
      </StepsContextProvider>
    )
  }
}

export class StepsRoot extends Component {
  state = {
    hasPortal: false,
  }

  handlePortalMounted = () => {
    if (!this.state.hasPortal) {
      this.setState({ hasPortal: true })
    }
  }

  render() {
    const { children, onEnd, wrapStep, name } = this.props
    debugger
    return (
      <StepsContextProvider base="/" next={onEnd} portal={name}>
        { wrapStep(<div ref={ node => this.handlePortalMounted() } id={name} />) }
        { this.state.hasPortal ? children : 'hola' }
      </StepsContextProvider>
    )
  }
}

export default withStepsContext(Steps)