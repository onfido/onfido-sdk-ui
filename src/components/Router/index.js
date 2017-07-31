import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions, events } from '../../core'
import {sendScreen} from '../../Tracker'

import { createComponentList } from './StepComponentMap'

const history = createHistory()

class Router extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      componentsList: this.createComponentListFromProps(this.props)
    }
    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
      this.trackScreen(this.currentComponent().screenName)
    })
  }

  nextStep = () => {
    const currentStep = this.state.step
    this.setStepIndex(currentStep + 1)
  }

  setStepIndex = (newStepIndex) => {
    const components = this.state.componentsList
    if (components.length === newStepIndex){
      events.emit('complete')
    }
    else {
      const state = { step: newStepIndex }
      const path = `${location.pathname}${location.search}${location.hash}`
      history.push(path, state)
    }
  }

  trackScreen = (...args) => sendScreen(this.currentComponent().stepType, ...args)

  currentComponent = () => this.state.componentsList[this.state.step]

  componentWillReceiveProps(nextProps) {
    const componentsList = this.createComponentListFromProps(this.props)
    this.setState({componentsList})
  }

  componentWillMount () {
    this.setStepIndex(this.state.step)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  formatStepsList = (steps) => (steps || ['welcome','document','face','complete']).map(formatStep)

  createComponentListFromProps = ({documentType, options:{steps}}) =>
    createComponentList(this.formatStepsList(steps), documentType)

  render = ({options: {steps, ...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    return (
      <div>
        <CurrentComponent
            {...{...componentBlob.stepOptions, ...globalUserOptions, ...otherProps}}
            nextStep = {this.nextStep}
            trackScreen = {this.trackScreen}/>
      </div>
    )
  }
}

const typeToStep = type => ({type})

const isStep = val => typeof val === 'object'

const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep)

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
