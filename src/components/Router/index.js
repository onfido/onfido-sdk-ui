import { h, Component } from 'preact'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import { pick } from '~utils/object'
import { isDesktop } from '~utils'
import { jwtExpired } from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import { componentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'
import { themeWrap } from '../Theme'
import Spinner from '../Spinner'
import GenericError from '../GenericError'
import { unboundActions } from '../../core'
import { getWoopraCookie, setWoopraCookie, trackException } from '../../Tracker'
import { LocaleProvider } from '../../locales'

const history = createHistory()
const restrictedXDevice = process.env.RESTRICTED_XDEVICE_FEATURE_ENABLED

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
    const url = props.options.urls.sync_url
    const roomId = window.location.pathname.substring(3) ||
      props.options.roomId
    this.state = {
      token: null,
      steps: null,
      step: null,
      socket: createSocket(url),
      roomId,
      crossDeviceError: false,
      loading: true
    }
    if (restrictedXDevice && isDesktop) {
      return this.setError('FORBIDDEN_CLIENT_ERROR')
    }
    this.state.socket.on('config', this.setMobileConfig(props.actions))
    this.state.socket.on('connect', () => {
      this.state.socket.emit('join', {roomId: this.state.roomId})
    })
    this.state.socket.open()
    this.requestMobileConfig()
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

  requestMobileConfig = () => {
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

  setMobileConfig = (actions) => (data) => {
    const {
      token,
      steps,
      language,
      documentType,
      poaDocumentType,
      step: userStepIndex,
      clientStepIndex,
      woopraCookie
    } = data

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

    const isFaceStep = steps[clientStepIndex].type === "face"

    this.setState(
      { token, steps,
        step: isFaceStep ? clientStepIndex : userStepIndex,
        stepIndexType: isFaceStep ? 'client' : 'user',
        crossDeviceError: false, language },
      // Temporary fix for https://github.com/valotas/preact-context/issues/20
      // Once a fix is released, it should be done in CX-2571
      () => this.setState({ loading: false })
    )
    if (poaDocumentType) {
      actions.setPoADocumentType(poaDocumentType)
    } else {
      actions.setIdDocumentType(documentType)
    }
    actions.acceptTerms()
  }

  setError = (name='GENERIC_CLIENT_ERROR') => {
    this.setState({crossDeviceError: { name }, loading: false})
  }

  onDisconnect = () => {
    this.pingTimeoutId = setTimeout(this.setError, 3000)
    this.sendMessage('disconnect ping')
  }

  onDisconnectPong = () =>
    this.clearPingTimeout()

  sendClientSuccess = () => {
    this.state.socket.off('custom disconnect', this.onDisconnect)
    const captures = Object.keys(this.props.captures).reduce((acc, key) => {
      const dataWhitelist = ['documentType', 'poaDocumentType', 'id', 'metadata', 'method', 'side']
      return acc.concat(pick(this.props.captures[key], dataWhitelist))
    }, [])
    this.sendMessage('client success', { captures })
  }

  render = () => {
    const { language } = this.state
    return (
      <LocaleProvider language={language}>
      {
        this.state.loading ? <WrappedSpinner disableNavigation={true} /> :
          this.state.crossDeviceError ? <WrappedError disableNavigation={true} error={this.state.crossDeviceError} /> :
            <HistoryRouter {...this.props} {...this.state}
              sendClientSuccess={this.sendClientSuccess}
              crossDeviceClientError={this.setError}
            />
      }
      </LocaleProvider>
    )
  }
}

class MainRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      crossDeviceInitialStep: null,
    }
  }

  mobileConfig = () => {
    const {documentType, poaDocumentType, options} = this.props
    const {steps, token, language} = options
    const woopraCookie = getWoopraCookie()

    return {steps, token, language, documentType, poaDocumentType, woopraCookie,
      step: this.state.crossDeviceInitialStep, clientStepIndex:this.state.crossDeviceInitialClientStep}
  }

  onFlowChange = (
    newFlow, newStep,
    previousFlow, {userStepIndex,clientStepIndex}) => {
      if (newFlow === "crossDeviceSteps"){
        this.setState({
          crossDeviceInitialStep: userStepIndex,
          crossDeviceInitialClientStep: clientStepIndex
        })
      }
  }

  render = (props) =>
    <HistoryRouter {...props}
      steps={props.options.steps}
      onFlowChange={this.onFlowChange}
      mobileConfig={this.mobileConfig()}
    />
}

const findFirstIndex = (componentsList, clientStepIndex) =>
  componentsList.findIndex(({stepIndex})=> stepIndex === clientStepIndex)

class HistoryRouter extends Component {
  constructor(props) {
    super(props)

    const componentsList = this.buildComponentsList({flow:'captureSteps'},this.props)

    const stepIndex = this.props.stepIndexType === "client" ?
      findFirstIndex(componentsList, this.props.step || 0) :
      this.props.step || 0

    this.state = {
      flow: 'captureSteps',
      step: stepIndex,
      initialStep: stepIndex,
    }
    this.unlisten = history.listen(this.onHistoryChange)
    this.setStepIndex(this.state.step, this.state.flow)
  }

  onHistoryChange = ({state:historyState}) => {
    this.setState({...historyState})
  }

  componentWillUnmount () {
    this.unlisten()
  }

  getStepType = step => {
    const componentList = this.getComponentsList()
    return componentList[step] ? componentList[step].step.type : null
  }

  disableNavigation = () => {
    return this.props.isNavigationDisabled || this.initialStep() || this.getStepType(this.state.step) === 'complete'
  }

  initialStep = () => this.state.initialStep === this.state.step && this.state.flow === 'captureSteps'

  changeFlowTo = (newFlow, newStep = 0, excludeStepFromHistory = false) => {
    const {flow: previousFlow, step: previousUserStepIndex} = this.state
    if (previousFlow === newFlow) return

    const previousUserStep = this.getComponentsList()[previousUserStepIndex]

    this.props.onFlowChange(newFlow, newStep,
      previousFlow,
      {
        userStepIndex: previousUserStepIndex,
        clientStepIndex: previousUserStep.stepIndex,
        clientStep: previousUserStep
      }
    )
    this.setStepIndex(newStep, newFlow, excludeStepFromHistory)
  }

  nextStep = () => {
    const { step: currentStep } = this.state
    const componentsList = this.getComponentsList()
    const newStepIndex = currentStep + 1
    if (componentsList.length === newStepIndex) {
      this.triggerOnComplete()
    }
    else {
      this.setStepIndex(newStepIndex)
    }
  }

  triggerOnComplete = () => {
    const { captures } = this.props;

    const data = Object.keys(captures).reduce((acc, key) => ({
      ...acc,
      [key]: captures[key].metadata
    }), {})

    this.props.options.events.emit('complete', data)
  }

  previousStep = () => {
    const {step: currentStep} = this.state
    this.setStepIndex(currentStep - 1)
  }

  back = () => {
    history.goBack()
  }

  setStepIndex = (newStepIndex, newFlow, excludeStepFromHistory) => {
    const { flow:currentFlow } = this.state
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

  getComponentsList = () => this.buildComponentsList(this.state, this.props)

  buildComponentsList =
    ({flow},
    {documentType, poaDocumentType, steps, options: {mobileFlow}}) =>
      componentsList({flow, documentType, poaDocumentType, steps, mobileFlow});

  render = (props) =>
    <StepsRouter {...props}
      componentsList={this.getComponentsList()}
      step={this.state.step}
      disableNavigation={this.disableNavigation()}
      changeFlowTo={this.changeFlowTo}
      nextStep={this.nextStep}
      previousStep={this.previousStep}
      back={this.back}
    />;
}

HistoryRouter.defaultProps = {
  onFlowChange: ()=>{},
  stepIndexType: 'user'
}

const mapStateToProps = state => ({
  ...state.globals,
  captures: state.captures,
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(unboundActions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Router)
