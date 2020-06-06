import { h, Component } from 'preact'
import createMemoryHistory from 'history/createMemoryHistory'

import { pick } from '~utils/object'
import { isDesktop } from '~utils'
import { jwtExpired } from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import { componentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'
import themeWrap from '../Theme'
import Spinner from '../Spinner'
import GenericError from '../GenericError'
import { getWoopraCookie, setWoopraCookie, trackException, uninstallWoopra } from '../../Tracker'
import { LocaleProvider } from '../../locales'
import { getEnterpriseFeaturesFromJWT } from '../utils/jwt'

const restrictedXDevice = process.env.RESTRICTED_XDEVICE_FEATURE_ENABLED

const Router = (props) => {
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
    const url = props.urls.sync_url
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
    if (this.props.options.mobileFlow) {
      addEventListener('userAnalyticsEvent', (event) => {
        this.sendMessage('user analytics', { detail: event.detail } )
      });
    }
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
      urls,
      steps,
      language,
      documentType,
      poaDocumentType,
      step: userStepIndex,
      clientStepIndex,
      woopraCookie,
      disableAnalytics,
      enterpriseFeatures
    } = data

    if (disableAnalytics) {
      uninstallWoopra()
    }
    else {
      setWoopraCookie(woopraCookie)
    }
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

    const isFaceStep = steps[clientStepIndex].type === 'face'

    this.setState(
      {
        token,
        steps,
        step: isFaceStep ? clientStepIndex : userStepIndex,
        stepIndexType: isFaceStep ? 'client' : 'user',
        crossDeviceError: false,
        language
      },
      // Temporary fix for https://github.com/valotas/preact-context/issues/20
      // Once a fix is released, it should be done in CX-2571
      () => this.setState({ loading: false })
    )
    if (urls) {
      actions.setUrls(urls)
    }
    if (poaDocumentType) {
      actions.setPoADocumentType(poaDocumentType)
    } else {
      actions.setIdDocumentType(documentType)
    }
    if (enterpriseFeatures) {
      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)
      
      if (enterpriseFeatures.hideOnfidoLogo && validEnterpriseFeatures?.hideOnfidoLogo) {
        actions.setOnfidoLogoDisabled(true)
      } else {
        actions.setOnfidoLogoDisabled(false)
      }
    } else {
      actions.setOnfidoLogoDisabled(false)
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
      crossDeviceInitialStep: null
    }
  }

  generateMobileConfig = () => {
    const {
      documentType,
      poaDocumentType,
      deviceHasCameraSupport,
      options,
      urls
    } = this.props
    const { steps, token, language, disableAnalytics, enterpriseFeatures } = options
    const woopraCookie = !disableAnalytics ? getWoopraCookie() : null

    return {
      steps,
      token,
      urls,
      language,
      documentType,
      poaDocumentType,
      deviceHasCameraSupport,
      woopraCookie,
      disableAnalytics,
      step: this.state.crossDeviceInitialStep,
      clientStepIndex: this.state.crossDeviceInitialClientStep,
      enterpriseFeatures
    }
  }

  onFlowChange = (
    newFlow,
    newStep,
    previousFlow,
    { userStepIndex, clientStepIndex }
  ) => {
    if (newFlow === 'crossDeviceSteps') {
      this.setState({
        crossDeviceInitialStep: userStepIndex,
        crossDeviceInitialClientStep: clientStepIndex
      })
    }
  }

  render = props => (
    <HistoryRouter
      {...props}
      steps={props.options.steps}
      onFlowChange={this.onFlowChange}
      mobileConfig={this.generateMobileConfig(props.actions)}
    />
  )
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
    this.history = createMemoryHistory()
    this.unlisten = this.history.listen(this.onHistoryChange)
    this.setStepIndex(this.state.step, this.state.flow)
  }

  onHistoryChange = ({ state: historyState }) => {
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

  formattedError = (response, status) => {
    if (typeof response === 'string') {
      // TODO: this if statement should be deleted once all APIs start using the same signature for responses
      // Currently detect_documents returns just a string. Examples:
      // `Could not decode token: hello`
      // `Token has expired.`
      // Telephony returns the a JSON response
      // {“unauthorized”:”Could not decode token: hello"}
      // {"unauthorized":"Token has expired."}
      // Tickets in backlog to update all APIs to use signature similar to main Onfido API
      let message;
      try {
        const jsonRes = JSON.parse(response)
        message = jsonRes.unauthorized || jsonRes.error || response
      }
      catch {
        // response is just a string so we will return it as the message
        message = response
      }
      const type = message.includes('expired') ? 'expired_token' : 'exception'
      return { type, message }
    }
    const apiError = response.error || {}
    const isExpiredTokenError = status === 401 && apiError.type === 'expired_token'
    const type = isExpiredTokenError ? 'expired_token' : 'exception'
    // TODO: delete response.reason once `v2/live_video_challenge` endpoints starts using the same signature for responses
    // `v2/live_video_challenge` returns a generic message for both invalid and expired tokens. Example:
    // {"reason":"invalid_token","status":"error"}
    // Ticket in backlog to update all APIs to use signature similar to main Onfido API
    const message = apiError.message || response.reason
    return { type, message }
  }

  triggerOnError = (apiResponse) => {
    const { status, response } = apiResponse
    if (status === 0) return
    const error = this.formattedError(response, status)
    const { type, message } = error
    this.props.options.events.emit('error', { type, message })
    trackException(`${type} - ${message}`)
  }

  previousStep = () => {
    const {step: currentStep} = this.state
    this.setStepIndex(currentStep - 1)
  }

  back = () => {
    this.history.goBack()
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
      this.history.push(path, newState)
    }
  }

  getComponentsList = () => this.buildComponentsList(this.state, this.props)

  buildComponentsList =
    ({flow},
    {documentType, poaDocumentType, steps, deviceHasCameraSupport, options: {mobileFlow}}) =>
      componentsList({flow, documentType, poaDocumentType, steps, mobileFlow, deviceHasCameraSupport});

  render = (props) =>
    <StepsRouter {...props}
      componentsList={this.getComponentsList()}
      step={this.state.step}
      disableNavigation={this.disableNavigation()}
      changeFlowTo={this.changeFlowTo}
      nextStep={this.nextStep}
      previousStep={this.previousStep}
      triggerOnError={this.triggerOnError}
      back={this.back}
    />;
}

HistoryRouter.defaultProps = {
  onFlowChange: ()=>{},
  stepIndexType: 'user'
}

export default Router
