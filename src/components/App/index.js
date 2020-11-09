import { h, Component } from 'preact'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EventEmitter from 'eventemitter2'
import Modal from '../Modal'
import Router from '../Router'
import * as Tracker from '../../Tracker'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import { LocaleProvider } from '../../locales'
import { actions } from '../ReduxAppWrapper/store/actions/'
import { getEnabledDocuments } from '~utils'
import { getCountryDataForDocumentType } from '../../supported-documents'
import {
  parseJwt,
  getUrlsFromJWT,
  getEnterpriseFeaturesFromJWT,
} from '~utils/jwt'

class ModalApp extends Component {
  constructor(props) {
    super(props)
    this.events = new EventEmitter()
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

  componentDidUpdate(prevProps) {
    this.jwtValidation(prevProps.options, this.props.options)
    this.prepareInitialStore(prevProps.options, this.props.options)
    this.rebindEvents(prevProps.options, this.props.options)
  }

  componentWillUnmount() {
    this.props.socket && this.props.socket.close()
    this.events.removeAllListeners('complete', 'error')
    Tracker.uninstall()
  }

  jwtValidation = (prevOptions = {}, newOptions = {}) => {
    if (prevOptions.token !== newOptions.token) {
      try {
        parseJwt(newOptions.token)
      } catch {
        this.onInvalidJWT('Invalid token')
      }
    }
  }

  onInvalidJWT = (message) => {
    const type = 'exception'
    this.events.emit('error', { type, message })
  }

  onInvalidEnterpriseFeatureException = (feature) => {
    const type = 'exception'
    const message = `EnterpriseFeatureNotEnabledException: Enterprise feature ${feature} not enabled for this account.`
    this.events.emit('error', { type, message })
    Tracker.trackException(message)
  }

  trackOnComplete = () => Tracker.sendEvent('completed flow')

  bindEvents = (onComplete, onError) => {
    this.events.on('complete', onComplete)
    this.events.on('error', onError)
  }

  rebindEvents = (oldOptions, newOptions) => {
    this.events.off('complete', oldOptions.onComplete)
    this.events.off('error', oldOptions.onError)
    this.bindEvents(newOptions.onComplete, newOptions.onError)
  }

  setIssuingCountryIfConfigured = (documentStep, preselectedDocumentType) => {
    const docTypes =
      documentStep && documentStep.options && documentStep.options.documentTypes
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

  prepareInitialStore = (prevOptions = {}, options = {}) => {
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
      const enabledDocs = getEnabledDocuments(steps)
      if (enabledDocs.length === 1) {
        const preselectedDocumentType = enabledDocs[0]
        this.props.actions.setIdDocumentType(preselectedDocumentType)
        const documentStep = steps.find((step) => step.type === 'document')
        this.setIssuingCountryIfConfigured(
          documentStep,
          preselectedDocumentType
        )
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

  setConfiguredEnterpriseFeatures = (validEnterpriseFeatures, options) => {
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

  setUrls = (token) => {
    const jwtUrls = getUrlsFromJWT(token)
    if (jwtUrls) {
      this.props.actions.setUrls(jwtUrls)
    }
  }

  hideDefaultLogoIfClientHasFeature = (isValidEnterpriseFeature) => {
    if (isValidEnterpriseFeature) {
      this.props.actions.hideOnfidoLogo(true)
    } else {
      this.props.actions.hideOnfidoLogo(false)
      this.onInvalidEnterpriseFeatureException('hideOnfidoLogo')
    }
  }

  displayCobrandIfClientHasFeature = (
    isValidEnterpriseFeature,
    cobrandConfig
  ) => {
    if (isValidEnterpriseFeature) {
      this.props.actions.showCobranding(cobrandConfig)
    } else {
      this.onInvalidEnterpriseFeatureException('cobrand')
    }
  }

  render = ({
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
  }) => {
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

const mapStateToProps = (state) => ({
  ...state.globals,
  captures: state.captures,
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
})

const ConnectedModalApp = connect(mapStateToProps, mapDispatchToProps)(ModalApp)

const App = ({ options }) => (
  <ReduxAppWrapper options={options}>
    <ConnectedModalApp options={options} />
  </ReduxAppWrapper>
)

export default App
