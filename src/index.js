import { h, render } from 'preact'
import { Provider } from 'react-redux'
import { store, events } from 'onfido-sdk-core'
import objectAssign from 'object-assign'

import Modal from './components/Modal'
import App from './components/app'

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

Onfido.init = (opts) => {
  const options = objectAssign({}, defaults, opts)
  options.mount = document.getElementById(options.containerId)
  Modal.create(options)
  render((
    <Provider store={store}>
      <App options={options}/>
    </Provider>
  ), options.mount)
}

export default Onfido
