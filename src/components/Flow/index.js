import { h, Component, cloneElement } from 'preact'
import { PureComponent, Children } from 'preact-compat'
import { withFlowContext, FlowContextProvider } from './context'
import { compose } from '../utils/func'

export { withFlowContext } from './context'
export { default as DynamicFlow } from './DynamicFlow'

class Flow extends PureComponent {

  constructor(props) {
    super(props)
    const { name, history } = props
    const { state = {} } = history.location
    this.state = {
      current: state[name] || 0,
    }
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
    const { name } = this.props
    const { state = {} } = location
    this.setState({ current: state[name] || 0 })
  }

  next = () => {
    const { children, name, next, history } = this.props
    const { location = {} } = history
    const { state = {} } = location
    const nextIndex = this.state.current + 1

    if (nextIndex < children.length) {
      history.push('', {
        ...state,
        [name]: nextIndex,
      })
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

export default withFlowContext(Flow)
