import { h, render } from 'preact'
import { Provider } from 'react-redux'
import EventEmitter from 'eventemitter2'
import { store, actions } from './core'
import Modal from './components/Modal'
import Router from './components/Router'
import Tracker from './Tracker'

const events = new EventEmitter()

Tracker.setUp()

const ModalApp = ({ options:{ useModal, isModalOpen, buttonId, ...otherOptions},
                    ...otherProps}) =>
  <Modal {...{useModal, buttonId}} isOpen={isModalOpen}>
    <Router options={otherOptions} {...otherProps}/>
  </Modal>

const Container = ({ options }) =>
  <Provider store={store}>
    <ModalApp options={options}/>
  </Provider>

/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 * @returns {DOMelement} Element which was generated from render
 */
const onfidoRender = (options, el, merge) =>
  render( <Container options={options}/>, el, merge)

const complete = (options) => {
  return () => {
    Tracker.sendEvent('completed flow')
    options.onComplete()
  }
}

const bindCompleteEvent = (options) => {
  events.on('complete', complete(options))
}

const unbindCompleteEvent = (options) => {
  events.off('complete', complete(options))
}

const rebindCompleteEvent = (newOptions, bindedComplete) => {
  unbindCompleteEvent(bindedComplete)
  bindCompleteEvent(newOptions)
}

const Onfido = {}

const noOp = ()=>{}

const defaults = {
  token: 'some token',
  buttonId: 'onfido-button',
  containerId: 'onfido-mount',
  onComplete: noOp
}

const isStep = val => typeof val === 'object'
const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : {type:typeOrStep}

const formatOptions = ({steps, ...otherOptions}) => ({
  ...otherOptions,
  steps: (steps || ['welcome','document','face','complete']).map(formatStep)
})


Onfido.init = (opts) => {
  console.log("onfido_sdk_version", process.env.SDK_VERSION)
  Tracker.track()
  const options = formatOptions({ ...defaults, ...opts, events })
  const bindedComplete = bindCompleteEvent(options)

  const containerEl = document.getElementById(options.containerId)
  const element = onfidoRender(options, containerEl)

  return {
    options,
    element,
    bindedComplete,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      this.options = formatOptions({...this.options,...changedOptions});
      this.bindedComplete = rebindCompleteEvent(this.options, this.bindedComplete);
      this.element = onfidoRender( this.options, containerEl, this.element )
      return this.options;
    },

    tearDown() {
      actions.reset()
      render(null, containerEl, this.element)
    }
  }
}

export default Onfido
