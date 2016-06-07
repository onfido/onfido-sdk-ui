import { h, render, Component } from 'preact'
import { Provider } from 'react-redux'
import { store, events, connect as ws } from 'onfido-sdk-core'
import Modal from './components/Modal'
import App from './components/app'
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
        <Router onChange={this.handleRoute}>
          <App options={options} path='/' />
          <App options={options} path='/step/:step/' />
        </Router>
      </Provider>
    )
  }

}

Onfido.init = (opts) => {
  route('/', true)
  const options = objectAssign({}, defaults, opts)
  options.mount = document.getElementById(options.containerId)
  Modal.create(options)
  render(<Container options={options}/>, options.mount)
}

Onfido.getCaptures = () => events.getCaptures()

export default Onfido
