import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import { unboundActions, events } from '../../core'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import { createComponentList } from './StepComponentMap'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import MobileLink from '../crossDevice/MobileLink'
import MobileFlowInProgress from '../crossDevice/MobileFlowInProgress'
import MobileFlowComplete from '../crossDevice/MobileFlowComplete'
import Complete from '../Complete'

const history = createHistory()

const masterFlowComponents = (documentType) => {
  return {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType),
    complete: () => [Complete]
  }
}

const mobileSyncComponents = {
  mobileLink: () => [MobileLink],
  mobileConnection: () => [MobileFlowInProgress, MobileFlowComplete]
}

const mobileSteps = [{'type': 'mobileLink'}, {'type': 'mobileConnection'}]

const createDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [Select, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfrim]
  }
  return frontDocumentFlow
}

const Router = (props) =>
    props.options.mobileFlow ?
      <MobileRouter {...props}/> : <DesktopRouter {...props}/>

class MobileRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: null,
      steps: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      roomId: window.location.pathname.substring(1),
    }
    this.state.socket.on('config', this.setConfig(props.actions))
    this.state.socket.emit('join', {room: this.state.roomId})
    this.requestConfig()
  }

  requestConfig = () => {
    this.state.socket.emit('message', {room: this.state.roomId, event: 'get config'})
  }

  setConfig = (actions) => {
    return (data) => {
      const {token, steps, documentType, step} = data
      this.setState({token, steps, step})
      actions.setDocumentType(documentType)
    }
  }

  render = (props) =>
      this.state.token ?
        <StepsRouter {...props} {...this.state}/> : <p>LOADING</p>
}

class DesktopRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roomId: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      mobileConnected: false,
      step: 0,
    }
    this.state.socket.on('joined', this.setRoomId)
    this.state.socket.on('get config', this.sendConfig)
    this.state.socket.emit('join', {})
  }

  setRoomId = (data) => {
    this.setState({roomId: data.roomId})
  }

  sendConfig = () => {
    const {documentType, options} = this.props
    const {steps, token} = options
    const config = {steps, token, documentType, step: this.state.step}
    this.state.socket.emit('message', {room: this.state.roomId, event: 'config', payload: config})
    this.setState({mobileConnected: true})
  }

  onStepChange = (step) => {
    this.setState({step})
  }

  render = (props) => {
    // TODO this URL should point to where we host the mobile flow
    const mobileUrl = `${document.location.origin}/${this.state.roomId}?mobileFlow=true`
    return (
      <StepsRouter {...props} onStepChange={this.onStepChange} mobileUrl={mobileUrl} />
    )
  }
}

class StepsRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      masterFlow: {
        step: this.props.step || 0,
        componentsList: this.createComponentListFromProps(this.props)
      },
      mobileSyncingFlow: {
        step: 0,
        componentList: createComponentList(mobileSyncComponents, mobileSteps)
      },
      startMobileSynchingFlow: false,
    }
    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
    })
  }

  nextStep = () => {
    const flow = this.currentFlow()
    const components = flow.componentsList
    const currentStep = flow.step
    const newStepIndex = currentStep + 1
    if (components.length === newStepIndex){
      events.emit('complete')
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  previousStep = () => {
    const flow = this.currentFlow()
    const currentStep = flow.step
    this.setStepIndex(currentStep - 1)
  }

  setStepIndex = (newStepIndex) => {
    const flow = this.currentFlow()
    const state = {[flow]: {step: newStepIndex} }
    const path = `${location.pathname}${location.search}${location.hash}`
    this.props.onStepChange && this.props.onStepChange(newStepIndex)
    history.push(path, state)
  }

  startMobileSynchingFlow = () => {
    this.setState({startMobileSynchingFlow: true})
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentFlow = () => {
    return this.state.startMobileSynchingFlow ? this.state.mobileSyncingFlow : this.state.masterFlow
  }

  currentComponent = () => {
    const flow = this.currentFlow()
    console.log(flow.componentsList[flow.step])
    return this.state.masterFlow.componentsList[this.state.masterFlow.step]
  }

  componentWillReceiveProps(nextProps) {
    const componentsList = this.createComponentListFromProps(nextProps)
    this.setState({masterFlow: {componentsList}})
  }

  componentWillMount () {
    this.setStepIndex(this.state.masterFlow.step)
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
          startMobileSynchingFlow={this.startMobileSynchingFlow}
        />
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
