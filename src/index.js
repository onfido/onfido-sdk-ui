import { h, render, Component } from 'preact'
import { Provider } from 'react-redux'
import { store, events, actions } from './core'
import Modal from './components/Modal'
import Router from './components/Router'
import forEach from 'object-loops/for-each'
import mapValues from 'object-loops/map'
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
const onfidoRender = (options, el, merge) => {
  return render( <Container options={options}/>, el, merge)
}

const stripOneCapture = ({blob, documentType, id, side}) => {
  const capture = {id, blob}
  if (documentType) capture.documentType = documentType
  if (side) capture.side = side
  return capture
}

const stripCapturesHash = captures => mapValues(captures,
  capture => capture ? stripOneCapture(capture) : null)

const getCaptures = () => stripCapturesHash(events.getCaptures())

function bindEvents (options) {
  const eventListenersMap = {
    ready: () => options.onReady(),
    documentCapture: () => options.onDocumentCapture(getCaptures().documentCapture),
    documentBackCapture: () => options.onDocumentCapture(getCaptures().documentBackCapture),
    faceCapture: () => options.onFaceCapture(getCaptures().faceCapture),
    complete: () => {
      const captures = getCaptures();

      const takenCaptures = mapValues(captures, value => !!value)
      Tracker.sendEvent('completed flow', takenCaptures)

      options.onComplete(captures)
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

Onfido.getCaptures = () => getCaptures()

const noOp = ()=>{}

const defaults = {
  token: 'some token',
  buttonId: 'onfido-button',
  containerId: 'onfido-mount',
  onReady: noOp,
  onDocumentCapture: noOp,
  onFaceCapture: noOp,
  onComplete: noOp
}


Onfido.init = (opts) => {
  Tracker.track()
  const options = { ...defaults, ...opts }
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
      this.options = {...this.options,...changedOptions};
      this.eventListenersMap = rebindEvents(this.options, this.eventListenersMap);
      this.element = onfidoRender( this.options, containerEl, this.element )
      return this.options;
    },

    tearDown() {
      // TODO should use a actions.resetState() once onfido-sdk-core has been merged
      // See https://github.com/onfido/onfido-sdk-ui/issues/158
      [
        { method: 'document', side: 'front' },
        { method: 'document', side: 'back' },
        { method: 'face', side: null }
      ].forEach(actions.deleteCaptures);

      render(null, containerEl, this.element)
    }
  }
}

export default Onfido
