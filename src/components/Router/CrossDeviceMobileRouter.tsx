import { h, Component } from 'preact'

import { pick } from '~utils/object'
import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import { jwtExpired, getEnterpriseFeaturesFromJWT } from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import withTheme from '../Theme'
import Spinner from '../Spinner'
import GenericError from '../GenericError'

import { setWoopraCookie, trackException, uninstallWoopra } from '../../Tracker'
import { LocaleProvider } from '../../locales'
import HistoryRouter from './HistoryRouter'

import type { ErrorNames, MobileConfig } from '~types/commons'
import type { SupportedLanguages, LocaleConfig } from '~types/locales'
import type { CaptureKeys } from '~types/redux'
import type {
  StepIndexType,
  ErrorProp,
  RouterProps as Props,
} from '~types/routers'
import type { StepConfig } from '~types/steps'

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

// Wrap components with theme that include navigation and footer
const WrappedSpinner = withTheme(Spinner)
const WrappedError = withTheme(GenericError)

type State = {
  crossDeviceError?: ErrorProp
  crossDeviceInitialStep?: number
  language?: SupportedLanguages | LocaleConfig
  loading?: boolean
  roomId?: string
  socket: SocketIOClient.Socket
  step?: number
  stepIndexType?: StepIndexType
  steps?: StepConfig[]
  token?: string
}

export default class CrossDeviceMobileRouter extends Component<Props, State> {
  private configTimeoutId?: number = null
  private pingTimeoutId?: number = null

  constructor(props: Props) {
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

  componentDidMount(): void {
    this.state.socket.on('custom disconnect', this.onDisconnect)
    this.state.socket.on('disconnect pong', this.onDisconnectPong)
  }

  componentWillUnmount(): void {
    this.clearConfigTimeout()
    this.clearPingTimeout()
    this.state.socket.close()
  }

  sendMessage = (event: string, payload?: Record<string, unknown>): void => {
    const roomId = this.state.roomId
    this.state.socket.emit('message', { roomId, event, payload })
  }

  requestMobileConfig = (): void => {
    this.sendMessage('get config')
    this.clearConfigTimeout()
    this.configTimeoutId = window.setTimeout(() => {
      if (this.state.loading) this.setError()
    }, 10000)
  }

  clearConfigTimeout = (): void =>
    this.configTimeoutId && clearTimeout(this.configTimeoutId)

  clearPingTimeout = (): void => {
    if (this.pingTimeoutId) {
      clearTimeout(this.pingTimeoutId)
      this.pingTimeoutId = null
    }
  }

  setMobileConfig = (data: MobileConfig): void => {
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

  setError = (name: ErrorNames = 'GENERIC_CLIENT_ERROR'): void =>
    this.setState({ crossDeviceError: { name }, loading: false })

  onDisconnect = (): void => {
    this.pingTimeoutId = window.setTimeout(this.setError, 3000)
    this.sendMessage('disconnect ping')
  }

  onDisconnectPong = (): void => this.clearPingTimeout()

  sendClientSuccess = (): void => {
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

  renderLoadingOrErrors = (): h.JSX.Element => {
    const { hasCamera } = this.props
    const { steps } = this.state
    const shouldStrictlyUseCamera =
      steps && steps.some(isUploadFallbackOffAndShouldUseCamera)

    if (this.state.loading) {
      return <WrappedSpinner disableNavigation />
    }

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

  render(): h.JSX.Element {
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
