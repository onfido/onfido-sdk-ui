import { h, render, Component } from 'preact'
import { Provider } from 'react-redux'
import { store, events, connect as ws } from 'onfido-sdk-core'
import Modal from './components/Modal'
import App from './components/App'
import { Router, route } from 'preact-router'
import _ from 'lodash'

const ModalApp = ({ options:{ useModal, isModalOpen, buttonId, ...otherOptions},
                    ...otherProps}) => (
  <Modal {...{useModal, buttonId}} isOpen={isModalOpen}>
    <App options={otherOptions} {...otherProps}/>
  </Modal>
)

const ContainerPure = ({ options, socket }) => (
  <Provider store={store}>
      <Router url='/'>
        <ModalApp options={options} socket={socket} path='/' />
        <ModalApp options={options} socket={socket} path='/step/:step/' />
      </Router>
  </Provider>
)

class Container extends Component {
  componentWillMount () {
    const { token } = this.props.options
    this.setState({ socket:ws(token) })
  }

  componentWillReceiveProps (nextProps) {
    const nextToken = nextProps.options.token
    if (this.props.options.token !== nextToken){
      this.setState({ socket:ws(nextToken) })
    }
  }

  render = ({options}) =>
    <ContainerPure {...this.props} socket={this.state.socket}/>
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


const Onfido = {}

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

Onfido.init = (opts) => {
  // route('/', true)
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
    }
  }
}

export default Onfido
