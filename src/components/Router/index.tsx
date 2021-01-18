import { h, Component, FunctionComponent } from 'preact'
import { EventEmitter2 } from 'eventemitter2'

import { pick } from '~utils/object'
import { isDesktop, getUnsupportedMobileBrowserError } from '~utils/index'
import { jwtExpired, getEnterpriseFeaturesFromJWT } from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import withTheme from '../Theme'
import Spinner from '../Spinner'
import GenericError, { OwnProps as GenericErrorProps } from '../GenericError'
import withCameraDetection, {
  CameraDetectionProps,
} from '../Capture/withCameraDetection'

import {
  getWoopraCookie,
  setWoopraCookie,
  trackException,
  uninstallWoopra,
} from '../../Tracker'
import { LocaleProvider } from '../../locales'
import HistoryRouter from './HistoryRouter'

import type {
  ErrorTypes,
  FlowVariants,
  NormalisedSdkOptions,
  MobileConfig,
} from '~types/commons'
import type { SupportedLanguages, LocaleConfig } from '~types/locales'
import type { StepConfig } from '~types/steps'
import type { ReduxProps } from 'components/App/withConnect'
import type { CaptureState } from 'components/ReduxAppWrapper/types'
import type { StepIndexType } from './types'
import type { ComponentStep } from './StepComponentMap'

const restrictedXDevice = process.env.RESTRICTED_XDEVICE_FEATURE_ENABLED

const isUploadFallbackOffAndShouldUseCamera = (step: StepConfig): boolean => {
  if (!step.options || (step.type != 'document' && step.type != 'face')) {
    return false
  }

  return (
    step.options?.uploadFallback === false &&
    (step.type === 'face' || step.options?.useLiveDocumentCapture)
  )
}

type CaptureKeys = keyof CaptureState

type OmittedSdkOptions = Omit<
  NormalisedSdkOptions,
  | 'containerEl'
  | 'containerId'
  | 'isModalOpen'
  | 'onModalRequestClose'
  | 'shouldCloseOnOverlayClick'
  | 'useModal'
> & {
  events?: EventEmitter2.emitter
}

type RouterOwnProps = {
  options: OmittedSdkOptions
} & ReduxProps

type RouterProps = RouterOwnProps & CameraDetectionProps

type FlowChangeCallback = (
  newFlow: FlowVariants,
  newStep: number,
  previousFlow: FlowVariants,
  payload: {
    userStepIndex: number
    clientStepIndex: number
    clientStep: ComponentStep
  }
) => void

type InternalRouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterProps

const Router: FunctionComponent<RouterProps> = (props) => {
  const RouterComponent = props.options.mobileFlow
    ? CrossDeviceMobileRouter
    : MainRouter

  return (
    <RouterComponent
      {...props}
      allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}
    />
  )
}

// Wrap components with theme that include navigation and footer
const WrappedSpinner = withTheme(Spinner)
const WrappedError = withTheme<GenericErrorProps>(GenericError)

type CrossDeviceState = {
  crossDeviceError?: {
    name: ErrorTypes
  }
  crossDeviceInitialStep?: number
  language?: SupportedLanguages | LocaleConfig
  loading?: boolean
  roomId?: string
  socket?: SocketIOClient.Socket
  step?: number
  stepIndexType?: StepIndexType
  steps?: StepConfig[]
  token?: string
}

class CrossDeviceMobileRouter extends Component<
  InternalRouterProps,
  CrossDeviceState
> {
  private configTimeoutId?: number = null
  private pingTimeoutId?: number = null

  constructor(props: InternalRouterProps) {
    super(props)
    // Some environments put the link ID in the query string so they can serve
    // the cross device flow without running nginx
    const url = props.urls.sync_url
    const roomId = window.location.pathname.substring(3) || props.options.roomId

    this.state = {
      crossDeviceError: null,
      loading: true,
      roomId,
      socket: createSocket(url),
      step: null,
      steps: null,
      token: null,
    }

    if (restrictedXDevice && isDesktop) {
      this.setError('FORBIDDEN_CLIENT_ERROR')
      return
    }

    this.state.socket.on('config', this.setMobileConfig)
    this.state.socket.on('connect', () => {
      this.state.socket.emit('join', { roomId: this.state.roomId })
    })
    this.state.socket.open()
    this.requestMobileConfig()

    if (this.props.options.mobileFlow) {
      this.sendMessage('cross device start')
      addEventListener('userAnalyticsEvent', (event: CustomEvent) => {
        this.sendMessage('user analytics', {
          detail: { ...event.detail, isCrossDevice: true },
        })
      })
    }
  }

  componentDidMount() {
    this.state.socket.on('custom disconnect', this.onDisconnect)
    this.state.socket.on('disconnect pong', this.onDisconnectPong)
  }

  componentWillUnmount() {
    this.clearConfigTimeout()
    this.clearPingTimeout()
    this.state.socket.close()
  }

  sendMessage = (event: string, payload?: Record<string, unknown>) => {
    const roomId = this.state.roomId
    this.state.socket.emit('message', { roomId, event, payload })
  }

  requestMobileConfig = () => {
    this.sendMessage('get config')
    this.clearConfigTimeout()
    this.configTimeoutId = window.setTimeout(() => {
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

  setMobileConfig = (data: MobileConfig) => {
    const {
      clientStepIndex,
      disableAnalytics,
      documentType,
      enterpriseFeatures,
      idDocumentIssuingCountry,
      language,
      poaDocumentType,
      step: userStepIndex,
      steps,
      token,
      urls,
      woopraCookie,
    } = data

    if (disableAnalytics) {
      uninstallWoopra()
    } else {
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
        crossDeviceError: null,
        language,
      },
      // Temporary fix for https://github.com/valotas/preact-context/issues/20
      // Once a fix is released, it should be done in CX-2571
      () => this.setState({ loading: false })
    )

    if (urls) {
      this.props.actions.setUrls(urls)
    }

    if (poaDocumentType) {
      this.props.actions.setPoADocumentType(poaDocumentType)
    } else {
      this.props.actions.setIdDocumentType(documentType)
      if (documentType !== 'passport') {
        this.props.actions.setIdDocumentIssuingCountry(idDocumentIssuingCountry)
      }
    }

    if (enterpriseFeatures) {
      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)

      if (
        enterpriseFeatures.hideOnfidoLogo &&
        validEnterpriseFeatures?.hideOnfidoLogo
      ) {
        this.props.actions.hideOnfidoLogo(true)
      } else {
        this.props.actions.hideOnfidoLogo(false)

        if (enterpriseFeatures.cobrand && validEnterpriseFeatures?.cobrand) {
          this.props.actions.showCobranding(enterpriseFeatures.cobrand)
        }
      }
    } else {
      this.props.actions.hideOnfidoLogo(false)
      this.props.actions.showCobranding(null)
    }

    this.props.actions.acceptTerms()
  }

  setError = (name: ErrorTypes = 'GENERIC_CLIENT_ERROR') =>
    this.setState({ crossDeviceError: { name }, loading: false })

  onDisconnect = () => {
    this.pingTimeoutId = window.setTimeout(this.setError, 3000)
    this.sendMessage('disconnect ping')
  }

  onDisconnectPong = () => this.clearPingTimeout()

  sendClientSuccess = () => {
    this.state.socket.off('custom disconnect', this.onDisconnect)
    const captures = (Object.keys(this.props.captures) as CaptureKeys[]).reduce(
      (acc, key) => {
        const dataWhitelist = [
          'documentType',
          'idDocumentIssuingCountry',
          'poaDocumentType',
          'id',
          'metadata',
          'method',
          'side',
        ]
        return acc.concat(pick(this.props.captures[key], dataWhitelist))
      },
      []
    )
    this.sendMessage('client success', { captures })
  }

  renderLoadingOrErrors = () => {
    const steps = this.state.steps
    const shouldStrictlyUseCamera =
      steps && steps.some(isUploadFallbackOffAndShouldUseCamera)
    const { hasCamera } = this.props

    if (this.state.loading) return <WrappedSpinner disableNavigation />
    if (this.state.crossDeviceError) {
      return (
        <WrappedError
          disableNavigation={true}
          error={this.state.crossDeviceError}
        />
      )
    }
    if (!hasCamera && shouldStrictlyUseCamera) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }
    return null
  }

  render() {
    const { language, step, steps, stepIndexType } = this.state

    return (
      <LocaleProvider language={language}>
        {this.renderLoadingOrErrors() || (
          <HistoryRouter
            {...this.props}
            crossDeviceClientError={this.setError}
            sendClientSuccess={this.sendClientSuccess}
            step={step}
            stepIndexType={stepIndexType}
            steps={steps}
          />
        )}
      </LocaleProvider>
    )
  }
}

type MainState = {
  crossDeviceInitialClientStep?: number
  crossDeviceInitialStep?: number
}

class MainRouter extends Component<InternalRouterProps, MainState> {
  constructor(props: InternalRouterProps) {
    super(props)

    this.state = {
      crossDeviceInitialStep: null,
    }
  }

  generateMobileConfig = (): MobileConfig => {
    const {
      documentType,
      idDocumentIssuingCountry,
      poaDocumentType,
      deviceHasCameraSupport,
      options,
      urls,
    } = this.props

    const {
      steps,
      token,
      language,
      disableAnalytics,
      enterpriseFeatures,
    } = options

    const woopraCookie = !disableAnalytics ? getWoopraCookie() : null

    return {
      clientStepIndex: this.state.crossDeviceInitialClientStep,
      deviceHasCameraSupport,
      disableAnalytics,
      documentType,
      enterpriseFeatures,
      idDocumentIssuingCountry,
      language,
      poaDocumentType,
      step: this.state.crossDeviceInitialStep,
      steps,
      token,
      urls,
      woopraCookie,
    }
  }

  onFlowChange: FlowChangeCallback = (
    newFlow,
    _newStep,
    _previousFlow,
    { userStepIndex, clientStepIndex }
  ) => {
    if (newFlow === 'crossDeviceSteps') {
      this.setState({
        crossDeviceInitialStep: userStepIndex,
        crossDeviceInitialClientStep: clientStepIndex,
      })
    }
  }

  renderUnsupportedBrowserError = () => {
    const steps = this.props.options.steps
    const shouldStrictlyUseCamera =
      steps && steps.some(isUploadFallbackOffAndShouldUseCamera)
    const { hasCamera } = this.props

    if (!isDesktop && !hasCamera && shouldStrictlyUseCamera) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    return null
  }

  render = () =>
    this.renderUnsupportedBrowserError() || (
      <HistoryRouter
        {...this.props}
        mobileConfig={this.generateMobileConfig()}
        onFlowChange={this.onFlowChange}
        stepIndexType="user"
        steps={this.props.options.steps}
      />
    )
}

export default withCameraDetection<RouterOwnProps>(Router)
