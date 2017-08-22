import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions, events } from '../../core'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
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
    })
  }

  nextStep = () => {
    const components = this.state.componentsList
    const currentStep = this.state.step
    const newStepIndex = currentStep + 1
    if (components.length === newStepIndex){
      events.emit('complete')
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  finalStep = () => {
    const components = this.state.componentsList
    this.setStepIndex(components.length - 1)
  }

  previousStep = () => {
    const currentStep = this.state.step
    this.setStepIndex(currentStep - 1)
  }

  setStepIndex = (newStepIndex) => {
    const state = { step: newStepIndex }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, state)
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.state.componentsList[this.state.step]

  componentWillReceiveProps(nextProps) {
    const componentsList = this.createComponentListFromProps(nextProps)
    this.setState({componentsList})
  }

  componentWillMount () {
    this.setStepIndex(this.state.step)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  createComponentListFromProps = ({documentType, options:{steps}}) =>
    createComponentList(steps, documentType)

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    return (
      <div>
        <CurrentComponent
          {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
          nextStep = {this.nextStep}
          previousStep = {this.previousStep}
          finalStep = {this.finalStep}
          trackScreen = {this.trackScreen}/>
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
