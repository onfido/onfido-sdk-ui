import { h, Component } from 'preact'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EventEmitter from 'eventemitter2'
import Modal from '../Modal'
import Router from '../Router'
import * as Tracker from '../../Tracker'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import { LocaleProvider } from '../../locales'
import { enabledDocuments } from '../Router/StepComponentMap'
import { actions } from '../ReduxAppWrapper/store/actions/'
import { parseJwt, getUrlsFromJWT } from '~utils/jwt'
import { getEnterpriseFeaturesFromJWT } from '../utils/jwt'

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
        this.onInvalidJWT()
      }
    }
  }

  onInvalidJWT = () => {
    const type = 'exception'
    const message = 'Invalid token'
    this.events.emit('error', { type, message })
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

  prepareInitialStore = (prevOptions = {}, options = {}) => {
    const { userDetails: { smsNumber } = {}, steps, token } = options
    const {
      userDetails: { smsNumber: prevSmsNumber } = {},
      steps: prevSteps,
      token: prevToken
    } = prevOptions

    if (smsNumber && smsNumber !== prevSmsNumber) {
      this.props.actions.setMobileNumber(smsNumber)
    }

    if (steps && steps !== prevSteps) {
      const enabledDocs = enabledDocuments(steps)
      if (enabledDocs.length === 1) {
        this.props.actions.setIdDocumentType(enabledDocs[0])
      }
    }

    if (!options.mobileFlow && token && token !== prevToken) {
      const jwtUrls = getUrlsFromJWT(token)
      if (jwtUrls) {
        this.props.actions.setUrls(jwtUrls)
      }
    }

    if (options.enterpriseFeatures && token && token !== prevToken) {
      const validEnterpriseFeatures = getEnterpriseFeaturesFromJWT(token)

      if (options.enterpriseFeatures.hideOnfidoLogo && validEnterpriseFeatures?.hideOnfidoLogo) {
        this.props.actions.setOnfidoLogoDisabled(true)
      } else {
        this.props.actions.setOnfidoLogoDisabled(false)
      }
    } else if (!options.enterpriseFeatures && !options.mobileFlow) {
      this.props.actions.setOnfidoLogoDisabled(false)
    }
  }

  render = ({
    options: {
      useModal,
      isModalOpen,
      onModalRequestClose,
      containerId,
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
  captures: state.captures
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

const ConnectedModalApp = connect(mapStateToProps, mapDispatchToProps)(ModalApp)

const App = ({ options }) =>
  <ReduxAppWrapper options={options}>
    <ConnectedModalApp options={options} />
  </ReduxAppWrapper>

export default App
