import { h, render } from 'preact'
import { Provider } from 'react-redux'
import { store, events, actions } from './core'
import Modal from './components/Modal'
import Router from './components/Router'
import forEach from 'object-loops/for-each'
import mapValues from 'object-loops/map'
import mapKeys from 'object-loops/map-keys'
import Tracker from './Tracker'

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

const mapCaptures = captures => mapValues(captures, capture => capture)

const getCapturesKeys = () => mapKeys(mapCaptures(events.getCaptures()), key => key + 'Capture')

function bindEvents (options) {
  const eventListenersMap = {
    complete: () => {
      const captures = getCapturesKeys();

      const takenCaptures = mapValues(captures, value => !!value)
      Tracker.sendEvent('completed flow', takenCaptures)

      options.onComplete()
    }
  }

  forEach(eventListenersMap, (listener, event) => events.on(event, listener))
  return eventListenersMap;
}

function unbindEvents (eventListenersMap) {
  forEach(eventListenersMap, (listener, event) => {
    events.off(event, listener)
  })
}

function rebindEvents(newOptions, previousEventListenersMap){
  if (previousEventListenersMap) unbindEvents(previousEventListenersMap)
  return bindEvents(newOptions)
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
  const options = formatOptions({ ...defaults, ...opts })
  const eventListenersMap = bindEvents(options)

  const containerEl = document.getElementById(options.containerId)
  const element = onfidoRender(options, containerEl)

  return {
    options,
    element,
    eventListenersMap,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      this.options = formatOptions({...this.options,...changedOptions});
      this.eventListenersMap = rebindEvents(this.options, this.eventListenersMap);
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
