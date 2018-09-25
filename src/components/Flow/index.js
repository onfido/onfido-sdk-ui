import { h, Component } from 'preact'
import { createPortal } from 'preact-compat'
import { withFlowContext, FlowContextProvider } from './context'
import { compose } from '../utils/func'

export { withFlowContext } from './context'
export { default as DynamicFlow } from './DynamicFlow'

class Flow extends Component {

  constructor(props) {
    super(props)
    const { name, history } = props
    const { state = {} } = history.location
    const { portal } = this.props
    this.portal = document.getElementById(portal)
    this.state = {
      currentIndex: state[name] || 0,
    }
  }

  componentDidMount() {
    const { history } = this.props
    this.unlisten = history.listen(this.handleHistoryChange)
    this.handleHistoryChange(history.location)
  }

  componentWillUpdate() {
    this.portal.childNodes.forEach(child => child.remove())
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten()
  }

  handleHistoryChange = location => {
    const { name } = this.props
    const { state = {} } = location
    this.setState({ currentIndex: state[name] || 0 })
  }

  nextStep = () => {
    const { children, name, nextStep, history } = this.props
    const { location = {} } = history
    const { state = {} } = location
    const nextIndex = this.state.currentIndex + 1

    if (nextIndex < children.length) {
      history.push('', {
        ...state,
        [name]: nextIndex,
      })
    } else {
      nextStep()
    }
  }

  prevStep = () => this.props.history.goBack()

  render() {
    const { nextStep, prevStep } = this
    const { currentIndex } = this.state
    const { history, portal, name } = this.props

    return (
      <FlowContextProvider {...{ prevStep, nextStep, history, portal }}>
        { createPortal(this.props.children[currentIndex], this.portal) }
      </FlowContextProvider>
    )
  }
}

export default withFlowContext(Flow)
