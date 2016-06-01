import { h, render } from 'preact'
import { Provider } from 'react-redux'
import { store, events } from 'onfido-sdk-core'
import Modal from './components/Modal'
import App from './components/app'

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

const Everything = ({ options }) => (
  <Provider store={store}>
    <App options={options}/>
  </Provider>
)

Onfido.init = (opts) => {
  const options = objectAssign({}, defaults, opts)
  options.mount = document.getElementById(options.containerId)
  Modal.create(options)
  render((<Everything options={options}/>), options.mount)
}

Onfido.getCaptures = () => events.getCaptures()

export default Onfido
