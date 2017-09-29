import { h, Component } from 'preact'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import { componentsList } from './StepComponentMap'
import { unboundActions } from '../../core'
import StepsRouter from './StepsRouter'
import { isDesktop } from '../utils'
import createHistory from 'history/createBrowserHistory'
import { events } from '../../core'

const history = createHistory()

const Router = (props) =>{
  const RouterComponent = props.options.mobileFlow ? CrossDeviceMobileRouter : MainRouter
  return <RouterComponent {...props} allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}/>
}


//TODO, delete once we own the hosting
const queryParams = () => window.location.search.slice(1)
                    .split('&')
                    .reduce( (/*Object*/ a, /*String*/ b) => {
                      b = b.split('=');
                      a[b[0]] = decodeURIComponent(b[1]);
                      return a;
                    }, {});

class CrossDeviceMobileRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      steps: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      //TODO, replace with this when we own the hosting:
      //roomId: window.location.pathname.substring(1),
      roomId: queryParams().roomId,
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

  onStepChange = ({step}) => {
    this.setState({step})
  }

  render = (props) => {
    return (
      this.state.token ?
        <HistoryRouter {...props} {...this.state}
          step={this.state.step}
          onStepChange={this.onStepChange}
        /> : <p>LOADING</p>
    )
  }
}

class MainRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roomId: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      mobileConnected: false,
      mobileInitialStep: null
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
    const config = {steps, token, documentType, step: this.state.mobileInitialStep}
    this.state.socket.emit('message', {room: this.state.roomId, event: 'config', payload: config})
    this.setState({mobileConnected: true})
  }


  onFlowChange = (newFlow, mobileInitialStep) => {
    console.log("flow changed!", newFlow, mobileInitialStep)
    if (newFlow === "crossDeviceSteps"){
      this.setState({mobileInitialStep})
    }
  }

  render = (props) => {
    return (
      <HistoryRouter {...props}
        onFlowChange={this.onFlowChange}
        roomId={this.state.roomId}
      />
    )
  }
}

class HistoryRouter extends Component {
  constructor(props) {
    super(props)
    const startFlow = 'captureSteps'
    const startStep = this.props.step || 0
    this.state = {
      flow: startFlow,
      step: startStep,
      componentsList: this.buildComponentsList({flow:startFlow}, this.props)
    }

    this.setStepIndex(startStep, startFlow)

    this.unlisten = history.listen(this.onHistoryChange)
  }

  onHistoryChange = ({state:historyState}) => {
    console.log("onHistoryChange", historyState)
    this.props.onStepChange(historyState)
    this.setState({
      ...historyState,
      componentsList: this.buildComponentsList(historyState, this.props)})
  }

  componentWillUnmount () {
    this.unlisten()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({componentsList: this.buildComponentsList(this.state, nextProps)})
  }

  changeFlowTo = (newFlow) => {
    const {flow: previousFlow, step: previousStep} = this.state
    if (previousFlow === newFlow) return
    this.props.onFlowChange(newFlow, previousStep, previousFlow)
    this.setStepIndex(0, newFlow)
  }

  nextStep = () => {
    const {componentsList, step: currentStep} = this.state
    const newStepIndex = currentStep + 1
    if (componentsList.length === newStepIndex){
      events.emit('complete')
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  previousStep = () => {
    const {step: currentStep} = this.state
    this.setStepIndex(currentStep - 1)
  }

  setStepIndex = (newStepIndex, newFlow) => {
    console.log("setStepIndex", newStepIndex, newFlow)
    const {flow:currentFlow} = this.state
    const historyState = {
      step: newStepIndex,
      flow: newFlow || currentFlow,
    }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, historyState)
  }

  buildComponentsList = ({flow}, {documentType,options:{steps}}) =>
    componentsList({flow,documentType,steps})

  render = (props) =>{
    console.log("render ", this.state.flow)
    return <StepsRouter {...props}
      componentsList={this.state.componentsList}
      step={this.state.step}
      changeFlowTo={this.changeFlowTo}
      nextStep={this.nextStep}
      previousStep={this.previousStep}
    />
  }
}

HistoryRouter.defaultProps = {
  onStepChange: ()=>{},
  onFlowChange: ()=>{}
}

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
