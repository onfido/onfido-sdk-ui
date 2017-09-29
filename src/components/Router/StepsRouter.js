import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'

import { events } from '../../core'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'

const history = createHistory()

class StepsRouter extends Component {
  constructor(props) {
    super(props)
    this.unlisten = history.listen(({state}) => {
      this.props.onStepChange(state)
    })
  }

  nextStep = () => {
    const components = this.props.componentsList
    const currentStep = this.props.step
    const newStepIndex = currentStep + 1
    if (components.length === newStepIndex){
      events.emit('complete')
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  previousStep = () => {
    const currentStep = this.props.step
    this.setStepIndex(currentStep - 1)
  }

  changeFlowTo = (newFlow) => {
    const initialStep = 0
    const mobileInitialStep = this.props.step
    this.setStepIndex(initialStep, newFlow, mobileInitialStep)
  }

  setStepIndex = (newStepIndex, newFlow, mobileInitialStep) => {
    const state = {
      step: newStepIndex,
      flow: newFlow || this.props.flow,
      mobileInitialStep: mobileInitialStep || null
    }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, state)
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  componentWillReceiveProps(nextProps) {
    const componentsList = nextProps.componentsList
    const step = nextProps.step
    this.setState({componentsList, step})
  }

  componentWillMount () {
    this.setStepIndex(this.props.step)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    return (
      <div>
        <CurrentComponent
          {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
          changeFlowTo={this.changeFlowTo}
          nextStep = {this.nextStep}
          previousStep = {this.previousStep}
          trackScreen = {this.trackScreen}
        />
      </div>
    )
  }
}

export default StepsRouter
