import { h, Component } from 'preact'

import { pick } from '~utils/object'
import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import { jwtExpired, getEnterpriseFeaturesFromJWT } from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import withTheme from '../Theme'
import { setUICustomizations, setCobrandingLogos } from '../Theme/utils'
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
  InternalRouterProps,
} from '~types/routers'
import type { StepConfig } from '~types/steps'
import type { Socket } from 'socket.io-client'

const restrictedXDevice = process.env.RESTRICTED_XDEVICE_FEATURE_ENABLED

const isUploadFallbackOffAndShouldUseCamera = (step: StepConfig): boolean => {
  if (!step.options || (step.type !== 'document' && step.type !== 'face')) {
    return false
  }

  return (
    step.options?.uploadFallback === false &&
    (step.type === 'face' || step.options?.useLiveDocumentCapture === true)
  )
}

const isPhotoCaptureFallbackOffAndCannotUseVideo = (
  step: StepConfig
): boolean => {
  if (!step.options || step.type !== 'face') {
    return false
  }

  const photoCaptureFallback = step.options.photoCaptureFallback ?? true

  const canVideoFallbackToPhoto =
    window.MediaRecorder != null || photoCaptureFallback

  const isLivenessRequired =
    !canVideoFallbackToPhoto && step.options.requestedVariant === 'video'

  return isLivenessRequired
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
  socket: Socket
  step?: number
  stepIndexType?: StepIndexType
  steps?: StepConfig[]
  token?: string
}

export default class CrossDeviceMobileRouter extends Component<
  InternalRouterProps,
  State
> {
  private configTimeoutId?: number
  private pingTimeoutId?: number

  constructor(props: InternalRouterProps) {
    super(props)
    // Some environments put the link ID in the query string so they can serve
    // the cross device flow without running nginx
    const url = props.urls.sync_url

    const roomId = window.location.pathname.substring(3) || props.options.roomId

    this.state = {
      crossDeviceError: undefined,
      loading: true,
      roomId,
      socket: createSocket(url),
      step: undefined,
      steps: undefined,
      token: undefined,
    }

    if (restrictedXDevice && isDesktop) {
      this.setError('FORBIDDEN_CLIENT_ERROR')
      return
    }

    this.state.socket.on('config', this.setUpHostedSDKWithMobileConfig)
    this.state.socket.on('connect', () => {
      this.state.socket.emit('join', { roomId: this.state.roomId })
    })
    this.state.socket.on('joined', () => {
      this.requestMobileConfig()
    })
    this.state.socket.open()

    if (this.props.options.mobileFlow) {
      this.sendMessage('cross device start')
      addEventListener('userAnalyticsEvent', (event) => {
        this.sendMessage('user analytics', {
          detail: { ...(event as CustomEvent).detail, isCrossDevice: true },
        })
      })
    }
  }

  componentDidMount(): void {
    this.state.socket.on('cross device start', this.onCrossBrowserStart)
    this.state.socket.on('custom disconnect', this.onDisconnect)
    this.state.socket.on('disconnect pong', this.onDisconnectPong)
  }

  componentWillUnmount(): void {
    this.clearConfigTimeout()
    this.clearPingTimeout()
    this.state.socket.close()
  }

  onCrossBrowserStart = (): void => {
    dispatchEvent(
      new CustomEvent('userAnalyticsEvent', {
        detail: {
          eventName: 'CROSS_DEVICE_START',
          isCrossDevice: true,
        },
      })
    )
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

  clearConfigTimeout = (): void => {
    this.configTimeoutId && clearTimeout(this.configTimeoutId)
  }

  clearPingTimeout = (): void => {
    if (this.pingTimeoutId) {
      clearTimeout(this.pingTimeoutId)
      this.pingTimeoutId = undefined
    }
  }

  setUpHostedSDKWithMobileConfig = (data: MobileConfig): void => {
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
      customUI,
    } = data

    if (disableAnalytics) {
      uninstallWoopra()
    } else if (woopraCookie) {
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

    const isFaceStep = clientStepIndex
      ? steps[clientStepIndex].type === 'face'
      : false

    this.setState(
      {
        token,
        steps,
        step: isFaceStep ? clientStepIndex : userStepIndex,
        stepIndexType: isFaceStep ? 'client' : 'user',
        crossDeviceError: undefined,
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
    } else if (documentType) {
      this.props.actions.setIdDocumentType(documentType)

      if (documentType !== 'passport' && idDocumentIssuingCountry) {
        this.props.actions.setIdDocumentIssuingCountry(idDocumentIssuingCountry)
      }
    }

    if (customUI) {
      setUICustomizations(customUI)
    }

    if (enterpriseFeatures) {
      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)

      if (
        enterpriseFeatures.hideOnfidoLogo &&
        validEnterpriseFeatures?.hideOnfidoLogo
      ) {
        this.props.actions.hideOnfidoLogo(true)
      } else if (
        enterpriseFeatures.cobrand &&
        validEnterpriseFeatures?.cobrand
      ) {
        this.props.actions.hideOnfidoLogo(false)
        this.props.actions.showCobranding(enterpriseFeatures.cobrand)
      } else {
        this.props.actions.hideOnfidoLogo(false)

        if (
          enterpriseFeatures.logoCobrand &&
          validEnterpriseFeatures?.logoCobrand
        ) {
          this.props.actions.showLogoCobranding(enterpriseFeatures.logoCobrand)
          setCobrandingLogos(enterpriseFeatures.logoCobrand)
        }
      }

      if (
        enterpriseFeatures.useCustomizedApiRequests &&
        validEnterpriseFeatures?.useCustomizedApiRequests
      ) {
        this.props.actions.setDecoupleFromAPI(true)
      }
    } else {
      this.props.actions.hideOnfidoLogo(false)
      this.props.actions.showCobranding(null)
      this.props.actions.showLogoCobranding(null)
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
        // @TODO: replace this over-generic method with something easier to maintain
        // @ts-ignore
        return acc.concat(pick(this.props.captures[key], dataWhitelist))
      },
      []
    )

    this.sendMessage('client success', { captures })
  }

  renderContent = (): h.JSX.Element => {
    const { hasCamera } = this.props
    const { crossDeviceError, loading, steps } = this.state
    const shouldStrictlyUseCamera = steps?.some(
      isUploadFallbackOffAndShouldUseCamera
    )
    const videoNotSupportedAndRequired = steps?.some(
      isPhotoCaptureFallbackOffAndCannotUseVideo
    )

    if (loading || !steps) {
      return <WrappedSpinner disableNavigation />
    }

    if (crossDeviceError) {
      return <WrappedError disableNavigation={true} error={crossDeviceError} />
    }

    if (
      (!hasCamera && shouldStrictlyUseCamera) ||
      videoNotSupportedAndRequired
    ) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    return (
      <HistoryRouter
        {...this.props}
        {...this.state}
        crossDeviceClientError={this.setError}
        sendClientSuccess={this.sendClientSuccess}
        steps={steps}
      />
    )
  }

  render(): h.JSX.Element {
    const { language } = this.state

    return (
      <LocaleProvider language={language}>
        {this.renderContent()}
      </LocaleProvider>
    )
  }
}
