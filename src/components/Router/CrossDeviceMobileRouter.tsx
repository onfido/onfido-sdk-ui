import { h, Component } from 'preact'

import { pick } from '~utils/object'
import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import {
  jwtExpired,
  getEnterpriseFeaturesFromJWT,
  getPayloadFromJWT,
} from '~utils/jwt'
import { createSocket } from '~utils/crossDeviceSync'
import withTheme from '../Theme'
import { setUICustomizations, setCobrandingLogos } from '../Theme/utils'
import Spinner from '../Spinner'
import GenericError from '../GenericError'
import {
  setupAnalyticsCookie,
  setWoopraCookie,
  trackException,
  uninstallAnalyticsCookie,
  uninstallWoopra,
} from '../../Tracker'
import { LocaleLoader, LocaleProvider } from '~locales'
import { HistoryRouterWrapper } from './HistoryRouter'
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
import { SdkConfigurationServiceProvider } from '~contexts/useSdkConfigurationService'
import { createCrossDeviceStepsHook } from './createCrossDeviceStepsHook'
import { PoASupportedCountriesProvider } from '~contexts/usePoASupportedCountries'
import { createWorkflowStepsHook } from './createWorkflowStepsHook'

const RESTRICTED_CROSS_DEVICE = process.env.RESTRICTED_XDEVICE_FEATURE_ENABLED

const CAPTURE_DATA_WHITELIST = [
  'documentType',
  'idDocumentIssuingCountry',
  'poaDocumentType',
  'id',
  'variant',
  'metadata',
  'method',
  'side',
]

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
  useWorkflow?: boolean
  workflowRunId?: string
  docPayload?: Record<string, unknown>[]
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
    const roomId = props.options.roomId || window.location.pathname.substring(3)

    this.state = {
      crossDeviceError: undefined,
      loading: true,
      roomId,
      socket: createSocket(url),
      step: undefined,
      steps: undefined,
      token: undefined,
      useWorkflow: false,
      docPayload: [],
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
      props.actions.setIsCrossDeviceClient(true)
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
      stepIndex,
      disableAnalytics,
      documentType,
      enterpriseFeatures,
      idDocumentIssuingCountry,
      language,
      poaDocumentType,
      steps,
      token,
      urls,
      woopraCookie,
      anonymousUuid,
      customUI,
      crossDeviceClientIntroProductName,
      crossDeviceClientIntroProductLogoSrc,
      analyticsSessionUuid,
      useWorkflow,
      workflowRunId,
    } = data
    if (disableAnalytics) {
      uninstallWoopra()
      uninstallAnalyticsCookie(this.props.actions.setAnonymousUuid)
    } else if (woopraCookie) {
      this.props.actions.setAnalyticsSessionUuid(analyticsSessionUuid)
      setWoopraCookie(woopraCookie)
      setupAnalyticsCookie(this.props.actions.setAnonymousUuid, anonymousUuid)
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

    // NOTE, This is should be removed as soon as motion is supported on Mobile
    const convertMotionStepToInitialConfig = (steps: StepConfig[]) => {
      const initialFaceStep =
        //@ts-ignore
        steps.find((s) => s.type === 'activeVideo')?.original

      if (!initialFaceStep) return steps

      return (
        steps &&
        steps.map((t) => (t.type === 'activeVideo' ? initialFaceStep : t))
      )
    }

    this.setState(
      {
        token,
        steps: convertMotionStepToInitialConfig(steps),
        step: stepIndex,
        stepIndexType: 'client',
        crossDeviceError: undefined,
        language,
        useWorkflow,
        workflowRunId,
        docPayload: [],
      },
      // Temporary fix for https://github.com/valotas/preact-context/issues/20
      // Once a fix is released, it should be done in CX-2571
      () => this.setState({ loading: false })
    )

    if (RESTRICTED_CROSS_DEVICE && isDesktop) {
      this.setError('FORBIDDEN_CLIENT_ERROR')
      return
    }

    if (token) {
      this.props.actions.setToken(token)
      const tokenPayload = getPayloadFromJWT(token)
      this.props.actions.setApplicantUuid(tokenPayload.app)
      this.props.actions.setClientUuid(tokenPayload.client_uuid)
    }

    if (urls) {
      this.props.actions.setUrls(urls)
    }

    if (poaDocumentType) {
      this.props.actions.setPoADocumentType(poaDocumentType)
    }

    if (documentType) {
      this.props.actions.setIdDocumentType(documentType)

      if (documentType !== 'passport' && idDocumentIssuingCountry) {
        this.props.actions.setIdDocumentIssuingCountry(idDocumentIssuingCountry)
      }
    }

    if (customUI) {
      setUICustomizations(customUI)
    }

    if (
      crossDeviceClientIntroProductName ||
      crossDeviceClientIntroProductLogoSrc
    ) {
      this.props.actions.setCrossDeviceClientIntroProductName(
        crossDeviceClientIntroProductName
      )
      this.props.actions.setCrossDeviceClientIntroProductLogoSrc(
        crossDeviceClientIntroProductLogoSrc
      )
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
    const { docPayload } = this.state
    const captureKeys = Object.keys(this.props.captures).filter(
      (key) => key !== 'takesHistory'
    ) as CaptureKeys[]
    const captures = captureKeys.reduce((acc, key) => {
      // @TODO: replace this over-generic method with something easier to maintain
      // @ts-ignore
      return acc.concat(pick(this.props.captures[key], CAPTURE_DATA_WHITELIST))
    }, [])
    this.sendMessage('client success', { captures, docPayload })
  }

  onCompleteStep = (docData: unknown[]): void => {
    this.setState({
      ...this.state,
      // @ts-ignore
      docPayload: [...this.state.docPayload, ...docData],
    })
  }

  renderContent = (): h.JSX.Element => {
    const { hasCamera, options, urls } = this.props
    const {
      crossDeviceError,
      steps,
      token,
      workflowRunId,
      useWorkflow,
    } = this.state

    if (crossDeviceError) {
      return <WrappedError disableNavigation={true} error={crossDeviceError} />
    }

    const shouldStrictlyUseCamera = steps?.some(
      isUploadFallbackOffAndShouldUseCamera
    )
    const videoNotSupportedAndRequired = steps?.some(
      isPhotoCaptureFallbackOffAndCannotUseVideo
    )
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

    if (steps) {
      return (
        <SdkConfigurationServiceProvider
          overrideConfiguration={this.props.options.overrideSdkConfiguration}
          url={this.props.urls.onfido_api_url}
          token={this.state.token}
          fallback={<WrappedSpinner disableNavigation />}
          triggerOnError={this.props.triggerOnError}
        >
          <PoASupportedCountriesProvider
            url={urls.onfido_api_url}
            token={this.state.token}
            fallback={
              <Spinner
                shouldAutoFocus={options.autoFocusOnInitialScreenTitle}
              />
            }
          >
            <HistoryRouterWrapper
              {...this.props}
              {...this.state}
              crossDeviceClientError={this.setError}
              sendClientSuccess={this.sendClientSuccess}
              useSteps={
                useWorkflow
                  ? createWorkflowStepsHook(
                      {
                        ...options,
                        token,
                        workflowRunId,
                        mobileFlow: true,
                      },
                      urls
                    )
                  : createCrossDeviceStepsHook(steps, this.onCompleteStep)
              }
            />
          </PoASupportedCountriesProvider>
        </SdkConfigurationServiceProvider>
      )
    }

    trackException(
      'Unable to load Cross Device mobile flow - an unhandled error has occurred'
    )
    return (
      <WrappedError
        disableNavigation={true}
        error={{ name: 'GENERIC_CLIENT_ERROR' }}
      />
    )
  }

  render(): h.JSX.Element {
    const { language, loading } = this.state
    const { autoFocusOnInitialScreenTitle } = this.props.options

    if (loading) {
      return <WrappedSpinner disableNavigation={true} />
    }

    return (
      <LocaleProvider language={language}>
        <LocaleLoader shouldAutoFocus={autoFocusOnInitialScreenTitle}>
          {this.renderContent()}
        </LocaleLoader>
      </LocaleProvider>
    )
  }
}
