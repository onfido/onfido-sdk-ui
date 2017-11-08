import { h, Component } from 'preact'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import createHistory from 'history/createBrowserHistory'

import { componentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'
import Spinner from '../Spinner'
import GenericError from '../crossDevice/GenericError'
import { unboundActions } from '../../core'
import { isDesktop } from '../utils'
import { jwtExpired } from '../utils/jwt'
import { getWoopraCookie, setWoopraCookie, sendError } from '../../Tracker'

const history = createHistory()

const Router = (props) =>{
  const RouterComponent = props.options.mobileFlow ? CrossDeviceMobileRouter : MainRouter
  return <RouterComponent {...props} allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}/>
}


class CrossDeviceMobileRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      steps: null,
      step: null,
      socket: io(process.env.DESKTOP_SYNC_URL, {autoConnect: false}),
      roomId: window.location.pathname.substring(3),
      error: false,
      loading: true
    }
    this.state.socket.on('config', this.setConfig(props.actions))
    this.state.socket.on('connect', () => {
      this.state.socket.emit('join', {roomId: this.state.roomId})
    })
    this.state.socket.open()
    this.requestConfig()
  }

  configTimeoutId = null
  pingTimeoutId = null

  componentDidMount() {
    this.state.socket.on('custom disconnect', this.onDisconnect)
    this.state.socket.on('disconnect pong', this.onDisconnectPong)
  }

  componentWillUnmount() {
    this.clearConfigTimeout()
    this.clearPingTimeout()
    this.state.socket.close()
  }

  sendMessage = (event, payload) => {
    const roomId = this.state.roomId
    this.state.socket.emit('message', {roomId, event, payload})
  }

  requestConfig = () => {
    this.sendMessage('get config')
    this.clearConfigTimeout()
    this.configTimeoutId = setTimeout(() => {
      if (this.state.loading) this.setError()
    }, 5000)
  }

  clearConfigTimeout = () =>
    this.configTimeoutId && clearTimeout(this.configTimeoutId)

  clearPingTimeout = () => {
    if (this.pingTimeoutId) {
      clearTimeout(this.pingTimeoutId)
      this.pingTimeoutId = null
    }
  }

  setConfig = (actions) => (data) => {
    const {token, steps, documentType, step, woopraCookie} = data
    setWoopraCookie(woopraCookie)
    if (!token) {
      console.error('Desktop did not send token')
      sendError('Desktop did not send token')
      return this.setError()
    }
    if (jwtExpired(token)) {
      console.error('Desktop token has expired')
      sendError(`Token has expired: ${token}`)
      return this.setError()
    }
    this.setState({token, steps, step, loading: false})
    actions.setDocumentType(documentType)
  }

  setError = () =>
    this.setState({error: true, loading: false})

  onDisconnect = () => {
    this.pingTimeoutId = setTimeout(this.setError, 3000)
    this.sendMessage('disconnect ping')
  }

  onDisconnectPong = () =>
    this.clearPingTimeout()

  onStepChange = ({step}) => {
    this.setState({step})
  }

  sendClientSuccess = () => {
    this.state.socket.off('custom disconnect', this.onDisconnect)
    this.sendMessage('client success')
  }

  render = (props) =>
    this.state.loading ? <Spinner /> :
      this.state.error ? <GenericError /> :
        <HistoryRouter {...props} {...this.state}
          onStepChange={this.onStepChange}
          sendClientSuccess={this.sendClientSuccess}
          crossDeviceClientError={this.setError}
        />
}


class MainRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobileInitialStep: null,
    }
  }

  mobileConfig = () => {
    const {documentType, options} = this.props
    const {steps, token} = options
    const woopraCookie = getWoopraCookie()
    return {steps, token, documentType, step: this.state.mobileInitialStep, woopraCookie}
  }

  onFlowChange = (newFlow, newStep, previousFlow, previousStep) => {
    if (newFlow === "crossDeviceSteps") this.setState({mobileInitialStep: previousStep})
  }

  render = (props) =>
    <HistoryRouter {...props}
      steps={props.options.steps}
      onFlowChange={this.onFlowChange}
      mobileConfig={this.mobileConfig()}
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

  changeFlowTo = (newFlow, newStep=0) => {
    const {flow: previousFlow, step: previousStep} = this.state
    if (previousFlow === newFlow) return
    this.props.onFlowChange(newFlow, newStep, previousFlow, previousStep)
    this.setStepIndex(newStep, newFlow)
  }

  nextStep = () => {
    const {step: currentStep} = this.state
    const componentsList = this.componentsList()
    const newStepIndex = currentStep + 1
    if (componentsList.length === newStepIndex) {
      this.props.options.events.emit('complete')
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  previousStep = () => {
    const {step: currentStep} = this.state
    this.setStepIndex(currentStep - 1)
  }

  back = () => {
    history.goBack()
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
  buildComponentsList = ({flow}, {documentType, steps, options: {mobileFlow}}) =>
    componentsList({flow, documentType, steps, mobileFlow});

  render = (props) =>
      <StepsRouter {...props}
        componentsList={this.componentsList()}
        step={this.state.step}
        changeFlowTo={this.changeFlowTo}
        nextStep={this.nextStep}
        previousStep={this.previousStep}
        back={this.back}
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
