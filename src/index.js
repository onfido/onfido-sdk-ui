
import { h, render, Component } from 'preact'
import EventEmitter from 'eventemitter2'
import { isSupportedCountry } from 'libphonenumber-js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchUrlsFromJWT } from '~utils/jwt'
import Modal from './components/Modal'
import Router from './components/Router'
import StoreWrapper from './components/StoreWrapper'
import * as Tracker from './Tracker'
import { LocaleProvider } from './locales'
import { upperCase } from '~utils/string'
import { enabledDocuments } from './components/Router/StepComponentMap'
import * as globals from './core/store/actions/globals'
import * as captures from './core/store/actions/captures'
import { RESET_STORE } from './core/constants'

const events = new EventEmitter()
const reset = payload => ({ type: RESET_STORE, payload })
const actions =  {...globals, ...captures, reset}

Tracker.setUp()

class ModalApp extends Component {
  constructor() {
    super()
    this.state = {actions}
  }
  componentDidMount() {
    this.prepareInitialStore(this.props.options)
    console.log(this.props)
  }

  componentDidUpdate(prevProps) {
    this.prepareInitialStore(this.props.options, prevProps.options)
  }

  prepareInitialStore = (options = {}, prevOptions = {}) => {
    const { userDetails: { smsNumber } = {}, steps} = options
    const { userDetails: { smsNumber: prevSmsNumber } = {}, steps: prevSteps } = prevOptions
    console.log(this.props)

    if (smsNumber && smsNumber !== prevSmsNumber) {
      this.props.actions.setMobileNumber(smsNumber)
    }

    if (steps && steps !== prevSteps) {
      const enabledDocs = enabledDocuments(steps)
      if (enabledDocs.length === 1) {
        this.props.actions.setIdDocumentType(enabledDocs[0])
      }
    }
  }

  render= ({options: {useModal, isModalOpen, onModalRequestClose, containerId, shouldCloseOnOverlayClick, ...otherOptions}, ...otherProps }) => {
    return (
      <Modal useModal={useModal} isOpen={isModalOpen} onRequestClose={onModalRequestClose} containerId={containerId} shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}>
        <Router options={otherOptions} {...otherProps}/>
      </Modal>
    )
  }
}
  
const mapStateToProps = state => ({
  ...state.globals,
  captures: state.captures,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
  ...bindActionCreators(actions, dispatch)

})

const ConnectedSDK = ({options}) => connect(mapStateToProps, mapDispatchToProps)(<ModalApp options={options}/>)

const Container = ({options}) =>
  <StoreWrapper>
    <LocaleProvider language={options.language}>
      <ConnectedSDK options={options} />
    </LocaleProvider>
  </StoreWrapper>
  
/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 * @returns {DOMelement} Element which was generated from render
 */
const onfidoRender = (options, el, merge) =>
  render(<Container options={options}/>, el, merge)

const trackOnComplete = () => Tracker.sendEvent('completed flow')
events.on('complete', trackOnComplete)

const bindEvents = ({onComplete, onError}) => {
  events.on('complete', onComplete)
  events.on('error', onError)
}

const rebindEvents = (oldOptions, newOptions) => {
  events.off('complete', oldOptions.onComplete)
  events.off('error', oldOptions.onError)
  bindEvents(newOptions)
}

const noOp = ()=>{}

const defaults = {
  token: undefined,
  urls: {
    onfido_api_url: `${process.env.ONFIDO_API_URL}`,
    telephony_url: `${process.env.SMS_DELIVERY_URL}`,
    hosted_sdk_url: `${process.env.MOBILE_URL}`,
    detect_document_url: `${process.env.ONFIDO_SDK_URL}`,
    sync_url: `${process.env.DESKTOP_SYNC_URL}`
  },
  containerId: 'onfido-mount',
  onComplete: noOp,
  onError: noOp
}

const isStep = val => typeof val === 'object'
const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : {type:typeOrStep}

const formatOptions = ({steps, smsNumberCountryCode, ...otherOptions}) => ({
  ...otherOptions,
  urls: jwtUrls(otherOptions),
  smsNumberCountryCode: validateSmsCountryCode(smsNumberCountryCode),
  steps: (steps || ['welcome','document','face','complete']).map(formatStep)
})

const experimentalFeatureWarnings = ({steps}) => {
  const isDocument = (step) => step.type === 'document'
  const documentStep = steps.find(isDocument)
  const isUseWebcamOptionEnabled = documentStep && documentStep.options && documentStep.options.useWebcam
  if (isUseWebcamOptionEnabled) {
    console.warn("`useWebcam` is an experimental option and is currently discouraged")
  }
  const isLiveDocumentCaptureEnabled = documentStep && documentStep.options && documentStep.options.useLiveDocumentCapture
  if (isLiveDocumentCaptureEnabled) {
    console.warn("`useLiveDocumentCapture` is a beta feature and is still subject to ongoing changes")
  }
}

const isSMSCountryCodeValid = (smsNumberCountryCode) => {
  const isCodeValid = isSupportedCountry(smsNumberCountryCode)
  if (!isCodeValid) {
    console.warn("`smsNumberCountryCode` must be a valid two-characters ISO Country Code. 'GB' will be used instead.")
  }
  return isCodeValid
}

const validateSmsCountryCode = (smsNumberCountryCode) => {
  if (!smsNumberCountryCode) return 'GB'
  return isSMSCountryCodeValid(smsNumberCountryCode) ? upperCase(smsNumberCountryCode) : 'GB'
}

const onInvalidJWT = () => {
  const type = 'exception'
  const message = 'Invalid token'
  events.emit('error', { type, message })
}

const jwtUrls = ({token}) => {
  const urls = token && fetchUrlsFromJWT(token, onInvalidJWT)
  return {...defaults.urls, ...urls}
}

export const init = (opts) => {
  console.log("onfido_sdk_version", process.env.SDK_VERSION)
  Tracker.install()
  const options = formatOptions({ ...defaults, ...opts, events })
  experimentalFeatureWarnings(options)

  bindEvents(options)

  const containerEl = document.getElementById(options.containerId)
  const element = onfidoRender(options, containerEl)

  return {
    options,
    element,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      const oldOptions = this.options
      this.options = formatOptions({...this.options,...changedOptions});
      if (!this.options.token) { onInvalidJWT() }
      rebindEvents(oldOptions, this.options);
      this.element = onfidoRender( this.options, containerEl, this.element )
      return this.options;
    },

    tearDown() {
      // const { socket } = store.getState().globals
      // socket && socket.close()
      // actions.reset()
      events.removeAllListeners('complete', 'error')
      render(null, containerEl, this.element)
      Tracker.uninstall()
    }
  }
}
