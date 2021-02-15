import { h, Component, ComponentType } from 'preact'
import { EventEmitter2 } from 'eventemitter2'

import { LocaleProvider } from '~locales'
import { getEnabledDocuments } from '~utils'
import {
  parseJwt,
  getUrlsFromJWT,
  getEnterpriseFeaturesFromJWT,
} from '~utils/jwt'
import Modal from '../Modal'
import Router from '../Router'
import * as Tracker from '../../Tracker'
import { getCountryDataForDocumentType } from '../../supported-documents'

import type { NormalisedSdkOptions } from '~types/commons'
import type {
  EnterpriseFeatures,
  EnterpriseCobranding,
} from '~types/enterprise'
import type { SdkOptions, SdkError, SdkResponse } from '~types/sdk'
import type {
  StepTypes,
  StepConfig,
  StepConfigDocument,
  DocumentTypes,
} from '~types/steps'

import withConnect, { ReduxProps } from './withConnect'

export type ModalAppProps = {
  options: NormalisedSdkOptions
}

type Props = ModalAppProps & ReduxProps

class ModalApp extends Component<Props> {
  private events: EventEmitter2.emitter

  constructor(props: Props) {
    super(props)
    this.events = new EventEmitter2()
    this.events.on('complete', this.trackOnComplete)
    if (!props.options.disableAnalytics) {
      Tracker.setUp()
      Tracker.install()
    }
    this.bindEvents(props.options.onComplete, props.options.onError)
  }

  componentDidMount() {
    this.prepareInitialStore({}, this.props.options)
  }

  componentDidUpdate(prevProps: Props) {
    this.jwtValidation(prevProps.options, this.props.options)
    this.prepareInitialStore(prevProps.options, this.props.options)
    this.rebindEvents(prevProps.options, this.props.options)
  }

  componentWillUnmount() {
    this.props.socket && this.props.socket.close()
    this.events.removeAllListeners(['complete', 'error'])
    Tracker.uninstall()
  }

  jwtValidation = (
    prevOptions: NormalisedSdkOptions = {},
    newOptions: NormalisedSdkOptions = {}
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

  trackOnComplete = () => Tracker.sendEvent('completed flow')

  bindEvents = (
    onComplete?: (data: SdkResponse) => void,
    onError?: (error: SdkError) => void
  ) => {
    onComplete && this.events.on('complete', onComplete)
    onError && this.events.on('error', onError)
  }

  rebindEvents = (
    oldOptions: NormalisedSdkOptions,
    newOptions: NormalisedSdkOptions
  ) => {
    this.events.off('complete', oldOptions.onComplete)
    this.events.off('error', oldOptions.onError)
    this.bindEvents(newOptions.onComplete, newOptions.onError)
  }

  setIssuingCountryIfConfigured = (
    steps: Array<StepTypes | StepConfig>,
    preselectedDocumentType: DocumentTypes
  ) => {
    const documentStep = steps.find(
      (step) => typeof step !== 'string' && step.type === 'document'
    )

    if (typeof documentStep === 'string' || !documentStep.options) {
      return
    }

    const docTypes = (documentStep as StepConfigDocument).options.documentTypes
    const preselectedDocumentTypeConfig = docTypes[preselectedDocumentType]

    if (typeof preselectedDocumentTypeConfig === 'boolean') {
      return
    }

    const countryCode = preselectedDocumentTypeConfig.country
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
    prevOptions: NormalisedSdkOptions = {},
    options: NormalisedSdkOptions = {}
  ) => {
    const { userDetails: { smsNumber } = {}, steps, token } = options
    const {
      userDetails: { smsNumber: prevSmsNumber } = {},
      steps: prevSteps,
      token: prevToken,
    } = prevOptions

    if (smsNumber && smsNumber !== prevSmsNumber) {
      this.props.actions.setMobileNumber(smsNumber)
    }

    if (steps && steps !== prevSteps) {
      const enabledDocs = getEnabledDocuments(steps) as DocumentTypes[]

      if (enabledDocs.length === 1) {
        const preselectedDocumentType = enabledDocs[0]
        this.props.actions.setIdDocumentType(preselectedDocumentType)
        this.setIssuingCountryIfConfigured(steps, preselectedDocumentType)
      }
    }

    if (token && token !== prevToken) {
      const isDesktopFlow = !options.mobileFlow
      if (isDesktopFlow) {
        this.setUrls(token)
      }

      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)
      this.setConfiguredEnterpriseFeatures(validEnterpriseFeatures, options)
    }
  }

  setConfiguredEnterpriseFeatures = (
    validEnterpriseFeatures: EnterpriseFeatures,
    options: SdkOptions
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
  }

  setUrls = (token: string) => {
    const jwtUrls = getUrlsFromJWT(token)

    if (jwtUrls) {
      this.props.actions.setUrls(jwtUrls)
    }
  }

  hideDefaultLogoIfClientHasFeature = (isValidEnterpriseFeature: boolean) => {
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

  render() {
    const {
      options: {
        useModal,
        isModalOpen,
        onModalRequestClose,
        containerId,
        containerEl,
        shouldCloseOnOverlayClick,
        ...otherOptions
      },
      ...otherProps
    } = this.props

    return (
      <LocaleProvider language={this.props.options.language}>
        <Modal
          useModal={useModal}
          isOpen={isModalOpen}
          onRequestClose={onModalRequestClose}
          containerId={containerId}
          containerEl={containerEl}
          shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
          <Router
            options={{ ...otherOptions, events: this.events }}
            {...otherProps}
          />
        </Modal>
      </LocaleProvider>
    )
  }
}

export default withConnect<ComponentType<ModalAppProps>>(ModalApp)
