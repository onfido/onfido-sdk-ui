import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions } from 'onfido-sdk-core'

import { createComponentList } from './StepComponentMap'
import Error from '../Error'

const history = createHistory()

class Router extends Component {
  initialState = { step: 0 }

  constructor(props) {
    super(props)
    this.setState(this.initialState)
    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
    })
  }

  nextStep = () => {
    const state = { step: this.state.step + 1 }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, state)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render = (props) => {
    const { websocketErrorEncountered, options, ...otherProps} = props
    const defaultStepOptions = ['welcome','document','face','complete']
    const stepOptions = options.steps || defaultStepOptions
    otherProps.nextStep = this.nextStep
    const componentList = createComponentList(stepOptions, otherProps)

    return (
      <div>
        <Error visible={websocketErrorEncountered}/>
        {componentList[this.state.step]}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)


