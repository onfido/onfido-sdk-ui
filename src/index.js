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

events.once('documentCapture', (data) => {
  console.log(data)
})

events.once('faceCapture', (data) => {
  console.log(data)
})

events.once('ready', () => {
  console.log('ready')
})

events.once('complete', (data) => {
  console.log(data)
})

const url = "https://gentle-gorge-17630.herokuapp.com/api"
const request = new XMLHttpRequest()
request.open('GET', url, true)
request.onload = () => {
  if (request.status >= 200 && request.status < 400) {
    const data = JSON.parse(request.responseText)
    Onfido.init({
      token: data.message
    })
  }
}
request.send()

export default Onfido
