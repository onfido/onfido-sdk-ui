import { h, Component } from 'preact'
import { EventEmitter2 } from 'eventemitter2'
import { v4 as uuidv4 } from 'uuid'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import { LocaleLoader, LocaleProvider } from '~locales'
import {
  parseJwt,
  getUrlsFromJWT,
  getEnterpriseFeaturesFromJWT,
  getPayloadFromJWT,
} from '~utils/jwt'
import { buildStepFinder, getEnabledDocuments } from '~utils/steps'
import Modal from '../Modal'
import Router from '../Router'
import * as Tracker from '../../Tracker'
import { getCountryDataForDocumentType } from '~supported-documents'

import type {
  NormalisedSdkOptions,
  SDKOptionsWithRenderData,
} from '~types/commons'
import type {
  EnterpriseFeatures,
  EnterpriseCobranding,
  EnterpriseLogoCobranding,
} from '~types/enterprise'
import type { ReduxProps } from '~types/routers'
import type { SdkError, SdkResponse, UserExitCode } from '~types/sdk'
import type { StepConfig, DocumentTypes } from '~types/steps'
import { setCobrandingLogos, setUICustomizations } from '../Theme/utils'
import withConnect from './withConnect'
import { setupAnalyticsCookie, uninstallAnalyticsCookie } from '../../Tracker'

export type ModalAppProps = {
  options: SDKOptionsWithRenderData
}

type Props = ModalAppProps & ReduxProps

class ModalApp extends Component<Props> {
  private readonly events: EventEmitter2.emitter

  constructor(props: Props) {
    super(props)
    this.events = new EventEmitter2()
    this.events.on('complete', this.trackOnComplete)
    const { actions, analyticsSessionUuid } = props

    // Note: analytics for the mobileFlow is set in the CrossDeviceMobileRouter
    if (!props.options.mobileFlow) {
      if (!props.options.disableAnalytics) {
        !analyticsSessionUuid && actions.setAnalyticsSessionUuid(uuidv4())
        setupAnalyticsCookie({
          setAnonymousUuid: props.actions.setAnonymousUuid,
          anonymousUuid: props.anonymousUuid,
          disableAnalyticsCookies: props.options.disableAnalyticsCookies,
        })
        Tracker.install()
      } else {
        uninstallAnalyticsCookie(props.actions.setAnonymousUuid)
      }
    }

    this.bindEvents(
      props.options.onComplete,
      props.options.onError,
      props.options.onUserExit
    )
    actions.setIsCrossDeviceClient(props.options.mobileFlow)
  }

  componentDidMount() {
    const { options } = this.props
    const { containerEl, containerId } = options
    this.prepareInitialStore({ steps: [], containerEl, containerId }, options)
    if (!options.mobileFlow) {
      const { customUI } = options
      const hasCustomUIConfigured =
        !!customUI && Object.keys(customUI).length > 0
      const trackedProperties = {
        is_custom_ui: hasCustomUIConfigured,
      }
      Tracker.sendEvent('started flow', trackedProperties)
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.jwtValidation(prevProps.options, this.props.options)
    this.prepareInitialStore(prevProps.options, this.props.options)
    this.rebindEvents(prevProps.options, this.props.options)
  }

  componentWillUnmount() {
    const { roomId, socket, actions } = this.props
    // clean up event listeners, socket and redux store after tearDown is invoked and the SDK is unmounted
    if (socket) {
      roomId && socket.emit('leave', { roomId })
      socket.close()
    }
    this.events.removeAllListeners('complete')
    this.events.removeAllListeners('error')
    Tracker.uninstall()
    actions.reset()
  }

  jwtValidation = (
    prevOptions: SDKOptionsWithRenderData,
    newOptions: SDKOptionsWithRenderData
  ) => {
    if (prevOptions.token !== newOptions.token) {
      try {
        parseJwt(newOptions.token)
      } catch {
        this.onInvalidJWT('Invalid token')
      }
    }
  }

  onInvalidJWT = (message: string) => {
    this.events.emit('error', { type: 'exception', message })
  }

  onInvalidEnterpriseFeatureException = (feature: string) => {
    const message = `EnterpriseFeatureNotEnabledException: Enterprise feature ${feature} not enabled for this account.`
    this.events.emit('error', { type: 'exception', message })
    Tracker.trackException(message)
  }

  onInvalidCustomApiException = (callbackName: string) => {
    const message = `CustomApiException: ${callbackName} must be a function that returns a promise for useCustomizedApiRequests to work properly.`
    this.events.emit('error', { type: 'exception', message })
    Tracker.trackException(message)
  }

  trackOnComplete = () => Tracker.sendEvent('completed flow')

  bindEvents = (
    onComplete?: (data: SdkResponse) => void,
    onError?: (error: SdkError) => void,
    onUserExit?: (error: UserExitCode) => void
  ) => {
    onComplete && this.events.once('complete', onComplete)
    onUserExit && this.events.once('userExit', onUserExit)
    onError && this.events.on('error', onError)
  }

  rebindEvents = (
    oldOptions: SDKOptionsWithRenderData,
    newOptions: SDKOptionsWithRenderData
  ) => {
    oldOptions.onComplete && this.events.off('complete', oldOptions.onComplete)
    oldOptions.onError && this.events.off('error', oldOptions.onError)
    oldOptions.onUserExit && this.events.off('userExit', oldOptions.onUserExit)

    this.bindEvents(
      newOptions.onComplete,
      newOptions.onError,
      newOptions.onUserExit
    )
  }

  setIssuingCountryIfConfigured = (
    steps: StepConfig[],
    preselectedDocumentType: DocumentTypes
  ) => {
    const findStep = buildStepFinder(steps)
    const documentStep = findStep('document')

    if (!documentStep?.options) {
      return
    }

    const docTypes = documentStep.options.documentTypes
    const preselectedDocumentTypeConfig = docTypes
      ? docTypes[preselectedDocumentType]
      : undefined

    if (typeof preselectedDocumentTypeConfig === 'boolean') {
      return
    }

    const countryCode = preselectedDocumentTypeConfig?.country
    const supportedCountry = getCountryDataForDocumentType(
      countryCode,
      preselectedDocumentType
    )

    if (supportedCountry) {
      this.props.actions.setIdDocumentIssuingCountry(supportedCountry)
    } else if (countryCode !== null) {
      // Integrators can set document type country to null to suppress Country Selection without setting a country
      // Anything else is an invalid country code
      console.error('Unsupported countryCode:', countryCode)
    }
  }

  prepareInitialStore = (
    prevOptions: SDKOptionsWithRenderData,
    options: SDKOptionsWithRenderData
  ) => {
    const {
      token,
      userDetails: { smsNumber } = {},
      steps,
      customUI,
      crossDeviceClientIntroProductName,
      crossDeviceClientIntroProductLogoSrc,
    } = options
    const {
      userDetails: { smsNumber: prevSmsNumber } = {},
      steps: prevSteps,
      token: prevToken,
      customUI: prevCustomUI,
      crossDeviceClientIntroProductName: prevCrossDeviceClientIntroProductName,
      crossDeviceClientIntroProductLogoSrc: prevCrossDeviceClientIntroProductLogoSrc,
    } = prevOptions

    if (smsNumber && smsNumber !== prevSmsNumber) {
      this.props.actions.setMobileNumber(smsNumber)
    }

    if (steps && steps !== prevSteps) {
      this.props.actions.setStepsConfig(steps)

      const enabledDocs = getEnabledDocuments(steps) as DocumentTypes[]

      if (enabledDocs.length === 1) {
        const preselectedDocumentType = enabledDocs[0]
        this.props.actions.setIdDocumentType(preselectedDocumentType)
        this.setIssuingCountryIfConfigured(steps, preselectedDocumentType)
      }
    }

    if (token && token !== prevToken) {
      this.props.actions.setToken(token)
      const tokenPayload = getPayloadFromJWT(token)
      this.props.actions.setApplicantUuid(tokenPayload.app)
      this.props.actions.setClientUuid(tokenPayload.client_uuid)

      const isDesktopFlow = !options.mobileFlow
      if (isDesktopFlow) {
        this.setUrls(token)
      }

      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)
      this.setConfiguredEnterpriseFeatures(validEnterpriseFeatures, options)
    }

    if (customUI && customUI !== prevCustomUI) {
      setUICustomizations(customUI)
    }

    if (
      crossDeviceClientIntroProductName &&
      crossDeviceClientIntroProductName !==
        prevCrossDeviceClientIntroProductName
    ) {
      this.props.actions.setCrossDeviceClientIntroProductName(
        crossDeviceClientIntroProductName
      )
    }
    if (
      crossDeviceClientIntroProductLogoSrc &&
      crossDeviceClientIntroProductLogoSrc !==
        prevCrossDeviceClientIntroProductLogoSrc
    ) {
      this.props.actions.setCrossDeviceClientIntroProductLogoSrc(
        crossDeviceClientIntroProductLogoSrc
      )
    }
  }

  setConfiguredEnterpriseFeatures = (
    validEnterpriseFeatures: EnterpriseFeatures,
    options: NormalisedSdkOptions
  ) => {
    const hideOnfidoLogo = options.enterpriseFeatures?.hideOnfidoLogo
    if (hideOnfidoLogo) {
      this.hideDefaultLogoIfClientHasFeature(
        validEnterpriseFeatures.hideOnfidoLogo
      )
    } else if (!options.mobileFlow) {
      this.props.actions.hideOnfidoLogo(false)
    }

    const cobrandConfig = options.enterpriseFeatures?.cobrand
    if (!hideOnfidoLogo && cobrandConfig) {
      this.displayCobrandIfClientHasFeature(
        validEnterpriseFeatures.cobrand,
        cobrandConfig
      )
    }

    const logoCobrandConfig = options.enterpriseFeatures?.logoCobrand
    if (!hideOnfidoLogo && !cobrandConfig && logoCobrandConfig) {
      this.displayLogoCobrandIfClientHasFeature(
        validEnterpriseFeatures.logoCobrand,
        logoCobrandConfig
      )
    }

    const isDecoupledFromAPI =
      options.enterpriseFeatures?.useCustomizedApiRequests
    if (isDecoupledFromAPI) {
      this.setDecoupleFromAPIIfClientHasFeature(
        validEnterpriseFeatures.useCustomizedApiRequests
      )
    }
  }

  setUrls = (token: string) => {
    const jwtUrls = getUrlsFromJWT(token)

    if (jwtUrls) {
      this.props.actions.setUrls(jwtUrls)
    }
  }

  hideDefaultLogoIfClientHasFeature = (isValidEnterpriseFeature?: boolean) => {
    if (isValidEnterpriseFeature) {
      this.props.actions.hideOnfidoLogo(true)
    } else {
      this.props.actions.hideOnfidoLogo(false)
      this.onInvalidEnterpriseFeatureException('hideOnfidoLogo')
    }
  }

  displayCobrandIfClientHasFeature = (
    isValidEnterpriseFeature: EnterpriseCobranding | null | undefined,
    cobrandConfig: EnterpriseCobranding
  ) => {
    if (isValidEnterpriseFeature) {
      this.props.actions.showCobranding(cobrandConfig)
    } else {
      this.onInvalidEnterpriseFeatureException('cobrand')
    }
  }

  displayLogoCobrandIfClientHasFeature = (
    isValidEnterpriseFeature: EnterpriseLogoCobranding | null | undefined,
    logoCobrandConfig: EnterpriseLogoCobranding
  ) => {
    if (isValidEnterpriseFeature) {
      this.props.actions.showLogoCobranding(logoCobrandConfig)
      setCobrandingLogos(logoCobrandConfig)
    } else {
      this.onInvalidEnterpriseFeatureException('logoCobrand')
    }
  }

  setDecoupleFromAPIIfClientHasFeature = (
    isValidEnterpriseFeature?: boolean
  ) => {
    const { actions, options } = this.props

    if (isValidEnterpriseFeature) {
      const { onSubmitDocument, onSubmitSelfie, onSubmitVideo } =
        options.enterpriseFeatures || {}

      if (typeof onSubmitDocument !== 'function') {
        this.onInvalidCustomApiException('onSubmitDocument')
      }

      if (typeof onSubmitSelfie !== 'function') {
        this.onInvalidCustomApiException('onSubmitSelfie')
      }

      const findStep = buildStepFinder(options.steps)
      const faceStep = findStep('face')

      if (faceStep?.options?.requestedVariant === 'video') {
        if (typeof onSubmitVideo !== 'function') {
          this.onInvalidCustomApiException('onSubmitVideo')
        }
      }

      actions.setDecoupleFromAPI(true)
    } else {
      actions.setDecoupleFromAPI(false)
      this.onInvalidEnterpriseFeatureException('useCustomizedApiRequests')
    }
  }

  render() {
    const { options, ...otherProps } = this.props
    const {
      useModal,
      isModalOpen,
      onModalRequestClose,
      containerId,
      containerEl,
      shouldCloseOnOverlayClick,
    } = options
    return (
      <LocaleProvider language={options.language}>
        <SdkOptionsProvider options={{ ...options, events: this.events }}>
          <Modal
            useModal={useModal}
            isOpen={isModalOpen}
            onRequestClose={onModalRequestClose}
            containerId={containerId}
            containerEl={containerEl}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
          >
            <LocaleLoader
              shouldAutoFocus={options.autoFocusOnInitialScreenTitle}
            >
              <Router {...otherProps} />
            </LocaleLoader>
          </Modal>
        </SdkOptionsProvider>
      </LocaleProvider>
    )
  }
}

export default withConnect(ModalApp)
