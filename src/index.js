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

const bindOnComplete = (options) => {
  const onComplete = () => {
    Tracker.sendEvent('completed flow')
    options.onComplete()
  }
  events.on('complete', onComplete)
  return onComplete
}

const unbindOnComplete = (onComplete) => {
  events.off('complete', onComplete)
}

const rebindOnComplete = (newOptions, previousOnComplete) => {
  if (previousOnComplete) unbindOnComplete(previousOnComplete)
  return bindOnComplete(newOptions)
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
  const _onComplete = bindOnComplete(options)

  const containerEl = document.getElementById(options.containerId)
  const element = onfidoRender(options, containerEl)

  return {
    options,
    element,
    _onComplete,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      this.options = formatOptions({...this.options,...changedOptions});
      this._onComplete = rebindOnComplete(this.options, this._onComplete);
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
