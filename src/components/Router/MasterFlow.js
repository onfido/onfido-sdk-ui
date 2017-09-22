import { h, Component } from 'preact'
import { events } from '../../core'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import { createComponentList } from './StepComponentMap'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import Complete from '../Complete'

const masterFlowComponents = (documentType) => {
  return {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType),
    complete: () => [Complete]
  }
}

const createDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [Select, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfrim]
  }
  return frontDocumentFlow
}

class MasterFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: this.props.step || 0,
      componentsList: this.createComponentListFromProps(this.props),
      history: this.props.history
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

  createComponentListFromProps = ({documentType, options:{steps}}) => {
    const masterComponents = masterFlowComponents(documentType)
    return createComponentList(masterComponents, steps)
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

export default MasterFlow
