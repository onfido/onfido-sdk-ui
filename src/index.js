import { h, render, Component } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import EventEmitter from 'eventemitter2'
import {isSupportedCountry} from 'libphonenumber-js'

import { fetchUrlsFromJWT } from '~utils/jwt'
import { store, actions } from './core'
import Modal from './components/Modal'
import Router from './components/Router'
import * as Tracker from './Tracker'
import { LocaleProvider } from './locales'
import {upperCase} from '~utils/string'
import {enabledDocuments} from './components/Router/StepComponentMap'

const events = new EventEmitter()

Tracker.setUp()

const ModalApp = ({ options:{ useModal, isModalOpen, onModalRequestClose, containerId, shouldCloseOnOverlayClick, ...otherOptions}, ...otherProps }) =>
  <Modal useModal={useModal} isOpen={isModalOpen} onRequestClose={onModalRequestClose} containerId={containerId} shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}>
    <Router options={otherOptions} {...otherProps}/>
  </Modal>

class Container extends Component {
  componentDidMount() {
    this.prepareInitialStore(this.props.options)
  }

  componentDidUpdate(prevProps) {
    this.prepareInitialStore(this.props.options, prevProps.options)
  }

  prepareInitialStore = (options = {}, prevOptions = {}) => {
    const { userDetails: { smsNumber } = {}, steps} = options
    const { userDetails: { smsNumber: prevSmsNumber } = {}, steps: prevSteps } = prevOptions

    if (smsNumber && smsNumber !== prevSmsNumber) {
      actions.setMobileNumber(smsNumber)
    }

    if (steps && steps !== prevSteps) {
      const enabledDocs = enabledDocuments(steps)
      if (enabledDocs.length === 1) {
        actions.setDocumentType(enabledDocs[0])
      }
    }
  }

  render() {
    const { options } = this.props

    return (
      <ReduxProvider store={store}>
        <LocaleProvider language={options.language}>
          <ModalApp options={options} />
        </LocaleProvider>
      </ReduxProvider>
    )
  }
}

/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 * @returns {DOMelement} Element which was generated from render
 */
const onfidoRender = (options, el, merge) =>
  render( <Container options={options}/>, el, merge)

const trackOnComplete = () => Tracker.sendEvent('completed flow')
events.on('complete', trackOnComplete)

const bindOnComplete = ({onComplete}) => {
  events.on('complete', onComplete)
}

const rebindOnComplete = (oldOptions, newOptions) => {
  events.off('complete', oldOptions.onComplete)
  bindOnComplete(newOptions)
}

const noOp = ()=>{}

const defaults = {
  token: 'some token',
  urls: {
    onfido_api_v2_url: `${process.env.ONFIDO_API_URL}/v2`,
    telephony_v1_url: `${process.env.SMS_DELIVERY_URL}`
  },
  containerId: 'onfido-mount',
  onComplete: noOp
}

const isStep = val => typeof val === 'object'
const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : {type:typeOrStep}

const formatOptions = ({steps, smsNumberCountryCode, ...otherOptions}) => ({
  ...otherOptions,
  smsNumberCountryCode: validateSmsCountryCode(smsNumberCountryCode),
  steps: (steps || ['welcome','document','face','complete']).map(formatStep)
})

const deprecationWarnings = ({steps}) => {
  const isDocument = (step) => step.type === 'document'
  const documentStep = steps.find(isDocument)
  const useWebcamOption = documentStep && documentStep.options && documentStep.options.useWebcam
  if (useWebcamOption) {
    console.warn("`useWebcam` is an experimental option and is currently discouraged")
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

export const init = (opts) => {
  console.log("onfido_sdk_version", process.env.SDK_VERSION)
  Tracker.install()
  const options = formatOptions({ ...defaults, ...opts, events })
  deprecationWarnings(options)

  bindOnComplete(options)

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

      const jwt_urls = fetchUrlsFromJWT(changedOptions.token)
      if (typeof jwt_urls === "undefined") {
        console.log("WARN: Using JWT that does not specify urls")
      }
      else {
        options.urls = {...jwt_urls, ...changedOptions.urls}
      }

      rebindOnComplete(oldOptions, this.options);
      this.element = onfidoRender( this.options, containerEl, this.element )
      return this.options;
    },

    tearDown() {
      const { socket } = store.getState().globals
      socket && socket.close()
      actions.reset()
      events.removeAllListeners('complete')
      render(null, containerEl, this.element)
      Tracker.uninstall()
    }
  }
}
