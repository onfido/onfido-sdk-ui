import { h, Component } from 'preact'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import createHistory from 'history/createBrowserHistory'
import URLSearchParams from 'url-search-params'

import { componentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'
import { themeWrap } from '../Theme'
import Spinner from '../Spinner'
import GenericError from '../crossDevice/GenericError'
import { unboundActions } from '../../core'
import { isDesktop } from '../utils'
import { jwtExpired } from '../utils/jwt'
import { initializeI18n } from '../../locales'
import { getWoopraCookie, setWoopraCookie, trackException } from '../../Tracker'

const history = createHistory()

const Router = (props) =>{
  const RouterComponent = props.options.mobileFlow ? CrossDeviceMobileRouter : MainRouter
  return <RouterComponent {...props} allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}/>
}

// Wrap components with theme that include navigation and footer
const WrappedSpinner = themeWrap(Spinner)
const WrappedError = themeWrap(GenericError)

class CrossDeviceMobileRouter extends Component {
  constructor(props) {
    super(props)
    // Some environments put the link ID in the query string so they can serve
    // the cross device flow without running nginx
    const searchParams = new URLSearchParams(window.location.search)
    const roomId = window.location.pathname.substring(3) ||
      searchParams.get('link_id').substring(2)
    this.state = {
      token: null,
      steps: null,
      step: null,
      i18n: initializeI18n(),
      socket: io(process.env.DESKTOP_SYNC_URL, {autoConnect: false}),
      roomId,
      crossDeviceError: false,
      loading: true,
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
    }, 10000)
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
    const {token, steps, language, documentType, step, woopraCookie} = data
    setWoopraCookie(woopraCookie)
    if (!token) {
      console.error('Desktop did not send token')
      trackException('Desktop did not send token')
      return this.setError()
    }
    if (jwtExpired(token)) {
      console.error('Desktop token has expired')
      trackException(`Token has expired: ${token}`)
      return this.setError()
    }
    this.setState({token, steps, step, loading: false, crossDeviceError: false, i18n: initializeI18n(language)})
    actions.setDocumentType(documentType)
    actions.acceptTerms()
  }

  setError = () =>
    this.setState({crossDeviceError: true, loading: false})

  onDisconnect = () => {
    this.pingTimeoutId = setTimeout(this.setError, 3000)
    this.sendMessage('disconnect ping')
  }

  onDisconnectPong = () =>
    this.clearPingTimeout()

  onStepChange = step => {
    this.setState({step})
  }

  sendClientSuccess = () => {
    this.state.socket.off('custom disconnect', this.onDisconnect)
    this.sendMessage('client success')
  }

  render = (props) =>
    this.state.loading ? <WrappedSpinner i18n={this.state.i18n} disableNavigation={true} /> :
      this.state.crossDeviceError ? <WrappedError i18n={this.state.i18n} disableNavigation={true} /> :
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
      crossDeviceInitialStep: null,
      i18n: initializeI18n(this.props.options.language)
    }
  }

  mobileConfig = () => {
    const {documentType, options} = this.props
    const {steps, token, language} = options
    const woopraCookie = getWoopraCookie()
    return {steps, token, language, documentType, step: this.state.crossDeviceInitialStep, woopraCookie}
  }

  onFlowChange = (newFlow, newStep, previousFlow, previousStep) => {
    if (newFlow === "crossDeviceSteps") this.setState({crossDeviceInitialStep: previousStep})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.language !== this.props.options.language) {
      this.setState({i18n: initializeI18n(nextProps.options.language)})
    }
  }

  render = (props) =>
    <HistoryRouter {...props}
      steps={props.options.steps}
      onFlowChange={this.onFlowChange}
      mobileConfig={this.mobileConfig()}
      i18n={this.state.i18n}
    />
}

class HistoryRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flow: 'captureSteps',
      step: this.props.step || 0,
      initialStep: this.props.step || 0,
    }
    this.unlisten = history.listen(this.onHistoryChange)
    this.setStepIndex(this.state.step, this.state.flow)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.step !== this.state.step) {
      this.props.onStepChange(nextState.step);
    }
  }

  onHistoryChange = ({state:historyState}) => {
    this.setState({...historyState})
  }

  componentWillUnmount () {
    this.unlisten()
  }

  disableNavigation = () => {
    const componentList = this.componentsList()
    const currentStepIndex = this.state.step
    const currentStepType = componentList[currentStepIndex].step.type
    return this.initialStep() || currentStepType === 'complete'
  }

  initialStep = () => this.state.initialStep === this.state.step && this.state.flow === 'captureSteps'

  changeFlowTo = (newFlow, newStep = 0, excludeStepFromHistory = false) => {
    const {flow: previousFlow, step: previousStep} = this.state
    if (previousFlow === newFlow) return
    this.props.onFlowChange(newFlow, newStep, previousFlow, previousStep)
    this.setStepIndex(newStep, newFlow, excludeStepFromHistory)
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

  setStepIndex = (newStepIndex, newFlow, excludeStepFromHistory) => {
    const {flow:currentFlow} = this.state
    const newState = {
      step: newStepIndex,
      flow: newFlow || currentFlow,
    }
    if (excludeStepFromHistory) {
      this.setState(newState)
    } else {
      const path = `${location.pathname}${location.search}${location.hash}`
      history.push(path, newState)
    }
  }

  componentsList = () => this.buildComponentsList(this.state, this.props)
  buildComponentsList = ({flow}, {documentType, steps, options: {mobileFlow}}) =>
    componentsList({flow, documentType, steps, mobileFlow});

  render = (props) =>
      <StepsRouter {...props}
        componentsList={this.componentsList()}
        step={this.state.step}
        disableNavigation={this.disableNavigation()}
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
