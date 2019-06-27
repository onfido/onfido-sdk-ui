import { h, render, Component } from 'preact'
import { getInitSdkOptions, queryStrings } from './demoUtils'

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

/*
The SDK can be consumed either via npm or via global window.
Via npm there are also two ways, via commonjs require or via ES import.
 */
/// #if DEMO_IMPORT_MODE === "window"
const Onfido = window.Onfido
/// #elif DEMO_IMPORT_MODE === "es"
import * as Onfido from '../index.js' // eslint-disable-line no-redeclare
/// #elif DEMO_IMPORT_MODE === "commonjs"
const Onfido = require('../index.js') // eslint-disable-line no-redeclare
/// #endif

const getToken = function(onSuccess) {
  const url = process.env.JWT_FACTORY
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      window.parent.postMessage({
        type: 'UPDATE_CHECK_DATA',
        payload: {
          applicantId: data.applicant_id
        }
      })
      onSuccess(data.message)
    }
  }
  request.send()
}


class SDK extends Component{
  componentDidMount () {
    this.initSDK(this.props.options)
  }

  componentWillReceiveProps({options}){
    if (this.state.onfidoSdk){
      this.state.onfidoSdk.setOptions(options)
      if (options.tearDown) {
        this.state.onfidoSdk.tearDown()
      }
    }
  }

  componentWillUnmount () {
    if (this.state.onfidoSdk) this.state.onfidoSdk.tearDown()
  }

  initSDK = (options)=> {
    console.log("Calling `Onfido.init` with the following options:", options)

    const onfidoSdk = Onfido.init(options)
    this.setState({onfidoSdk})

    window.onfidoSdkHandle = onfidoSdk
  }

  shouldComponentUpdate () {
    return false
  }

  render = () => <div id="onfido-mount"></div>
}

class Demo extends Component{
  constructor (props) {
    super(props)
    getToken((token)=> {
      this.setState({token})
    })
  }

  state = {
    token: null,
    isModalOpen: false
  }

  render () {
    const {
      containerWidth = '100%',
      containerHeight = '100%',
      rootFontSize = '16px',
      containerFontSize = '16px',
      tearDown
    } = this.props.viewOptions || {}
    // super bad practice, but just setting the sizing on the root node directly
    rootNode.style = `
      width: ${containerWidth};
      height: ${containerHeight};
      font-size: ${containerFontSize};`
    document.body.style = `font-size: ${rootFontSize};`

    if (tearDown) return "SDK has been torn down"

    const options = {
      ...getInitSdkOptions(),
      ...this.state,
      onComplete: data => window.parent.postMessage({ type: 'SDK_COMPLETE', data }),
      onModalRequestClose: () => this.setState({ isModalOpen: false }),
      ...(this.props.sdkOptions || {})
    }

    return <div class="container">
      {options.useModal &&
        <button
          id="button"
          type="button"
          onClick={ () => this.setState({isModalOpen: true}) }>
            Verify identity
        </button>
      }
      {queryStrings.async === 'false' && this.state.token === null ?
        null : <SDK options={options}></SDK>
      }
    </div>
  }
}


const rootNode = document.getElementById('demo-app')

let container;
window.addEventListener('message', message => {
  if (message.data.type === 'RENDER')
    container = render(
      <Demo {...message.data.options} />,
      rootNode,
      container
    )
  else if (message.data.type === 'SDK_COMPLETE')
    console.log("everything is complete", message.data.data)
})

if (window.parent === window) {
  // if we have no parent, then we tell ourselves to render straight away!
  window.postMessage({ type: 'RENDER' })
}
else
  window.parent.postMessage({ type: 'RENDER_DEMO_READY' })
