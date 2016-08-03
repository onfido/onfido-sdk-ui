import { h, render, Component } from 'preact'
import { Provider } from 'react-redux'
import { store, events, connect as ws } from 'onfido-sdk-core'
import Modal from './components/Modal'
import App from './components/App'
import { Router, route } from 'preact-router'

import objectAssign from 'object-assign'

const Onfido = {}

const defaults = {
  token: 'some token',
  buttonId: 'onfido-button',
  containerId: 'onfido-mount',
  onReady: null,
  onDocumentCapture: null,
  onFaceCapture: null,
  onComplete: null
}

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

function bindEvents (options) {
  events.once('ready', () => options.onReady())
  events.once('documentCapture', data => options.onDocumentCapture(data))
  events.once('faceCapture', data => options.onFaceCapture(data))
  events.once('complete', data => options.onComplete(data))
}

/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 */
const onfidoRender = (options, el, merge) => {
  bindEvents(options)
  return render( <Container options={options}/>, el, merge)
}

//TODO make reinitialisation work on the same element, the culpirt is Modal
Onfido.init = (opts) => {
  // route('/', true)
  const options = objectAssign({}, defaults, opts)
  options.mount = document.getElementById(options.containerId)
  Modal.create(options)//TODO turn this into a react component

  const element = onfidoRender(options, options.mount)

  return {
    options,
    element,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      this.options = {...options,...changedOptions};
      this.component = onfidoRender( this.options, options.mount, element )
      return this.options;
    }
  }
}

Onfido.getCaptures = () => events.getCaptures()

export default Onfido
