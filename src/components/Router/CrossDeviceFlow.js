import { h, Component } from 'preact'

import { events } from '../../core'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import { createComponentList } from './StepComponentMap'

import MobileLink from '../crossDevice/MobileLink'
import MobileFlowInProgress from '../crossDevice/MobileFlowInProgress'
import MobileFlowComplete from '../crossDevice/MobileFlowComplete'

const crossDeviceComponents = {
  mobileLink: () => [MobileLink],
  mobileConnection: () => [MobileFlowInProgress, MobileFlowComplete]
}

const mobileSteps = [{'type': 'mobileLink'}, {'type': 'mobileConnection'}]

class CrossDeviceFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      componentsList: createComponentList(crossDeviceComponents, mobileSteps),
      history: this.props.history,
      mobileUrl: this.props.mobileUrl
    }
    this.unlisten = this.state.history.listen(({state = this.initialState}) => {
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

  previousStep = () => {
    const currentStep = this.state.step
    this.setStepIndex(currentStep - 1)
  }

  setStepIndex = (newStepIndex) => {
    const state = { step: newStepIndex }
    const path = `${location.pathname}${location.search}${location.hash}`
    this.props.onStepChange && this.props.onStepChange(newStepIndex)
    this.state.history.push(path, state)
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.state.componentsList[this.state.step]

  componentWillReceiveProps() {
    const componentsList = createComponentList(crossDeviceComponents, mobileSteps)
    this.setState({componentsList})
  }

  componentWillMount () {
    this.setStepIndex(this.state.step)
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
          nextStep = {this.nextStep}
          previousStep = {this.previousStep}
          trackScreen = {this.trackScreen}
          startCrossDevice = {this.props.startCrossDevice}
        />
      </div>
    )
  }
}

export default CrossDeviceFlow
