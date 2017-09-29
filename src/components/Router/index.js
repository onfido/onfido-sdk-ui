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
    if (newFlow === "crossDeviceSteps") this.setState({mobileInitialStep})
  }

  render = (props) =>
      <HistoryRouter {...props}
        onFlowChange={this.onFlowChange}
        roomId={this.state.roomId}
      />
}

class HistoryRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flow: 'captureSteps',
      step: this.props.step || 0,
    }
    this.unlisten = history.listen(this.onHistoryChange)
    this.setStepIndex(this.state.step, this.state.flow)
  }

  onHistoryChange = ({state:historyState}) => {
    this.props.onStepChange(historyState)
    this.setState({...historyState})
  }

  componentWillUnmount () {
    this.unlisten()
  }

  changeFlowTo = (newFlow) => {
    const {flow: previousFlow, step: previousStep} = this.state
    if (previousFlow === newFlow) return
    this.props.onFlowChange(newFlow, previousStep, previousFlow)
    this.setStepIndex(0, newFlow)
  }

  nextStep = () => {
    const {step: currentStep} = this.state
    const componentsList = this.componentsList()
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
    const {flow:currentFlow} = this.state
    const historyState = {
      step: newStepIndex,
      flow: newFlow || currentFlow,
    }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, historyState)
  }

  componentsList = () => this.buildComponentsList(this.state, this.props)
  buildComponentsList = ({flow}, {documentType,options:{steps}}) =>
    componentsList({flow,documentType,steps});

  render = (props) =>
      <StepsRouter {...props}
        componentsList={this.componentsList()}
        step={this.state.step}
        changeFlowTo={this.changeFlowTo}
        nextStep={this.nextStep}
        previousStep={this.previousStep}
      />;
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
