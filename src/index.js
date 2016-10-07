import { h, render, Component } from 'preact'
import { Provider } from 'react-redux'
import { store, events, connect as ws } from 'onfido-sdk-core'
import Modal from './components/Modal'
import App from './components/App'
import { Router, route } from 'preact-router'
import _ from 'lodash'

import objectAssign from 'object-assign'

const Onfido = {}

class Container extends Component {

  handleRoute = (e) => {
    this.currentUrl = e.url
  }

  render () {
    const { options } = this.props
    return (
      <Provider store={store}>
        <Router onChange={this.handleRoute} url='/'>
          <App options={options} path='/' />
          <App options={options} path='/step/:step/' />
        </Router>
      </Provider>
    )
  }
}

/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 * @returns {DOMelement} Element which was generated from render
 */
const onfidoRender = (options, el, merge) => {
  return render( <Container options={options}/>, el, merge)
}

const stripOneCapture = ({image,documentType,id}) =>
  documentType === undefined ? {id,image} : {id,image,documentType}

const stripCapturesHashToNecessaryValues = captures => _.mapValues(captures,
  capture => capture ? stripOneCapture(capture) : null)

function bindEvents (options) {
  const strip = stripCapturesHashToNecessaryValues
  const eventListenersMap = {
    ready: () => options.onReady(),
    documentCapture: data => options.onDocumentCapture(strip(data)),
    faceCapture: data => options.onFaceCapture(strip(data)),
    complete: data => options.onComplete(strip(data))
  }

  _.forIn(eventListenersMap, (listener, event) => {
    events.once(event, listener)
  })

  return eventListenersMap;
}

function unbindEvents (eventListenersMap) {
  _.forIn(eventListenersMap, (listener, event) => {
    events.off(event, listener)
  })
}

function rebindEvents(newOptions, previousEventListenersMap){
  if (previousEventListenersMap) unbindEvents(previousEventListenersMap)
  return bindEvents(newOptions)
}


Onfido.getCaptures = () => stripCapturesHashToNecessaryValues(events.getCaptures())


const defaults = {
  token: 'some token',
  buttonId: 'onfido-button',
  containerId: 'onfido-mount',
  onReady: null,
  onDocumentCapture: null,
  onFaceCapture: null,
  onComplete: null
}

//TODO make reinitialisation work on the same element, the culpirt is Modal
Onfido.init = (opts) => {
  // route('/', true)
  const options = { ...defaults, ...opts }
  Modal.create(options)//TODO turn this into a react component

  const eventListenersMap = bindEvents(options)
  const element = onfidoRender(options, options.mount)

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
      this.element = onfidoRender( this.options, this.options.mount, this.element )
      return this.options;
    }
  }
}

export default Onfido
