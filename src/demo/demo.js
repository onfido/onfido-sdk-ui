import { h, render, Component } from 'preact'
import { getInitSdkOptions, queryParamToValueString } from './demoUtils'

/*
The SDK can be consumed either via npm or via global window.
Via npm there are also two ways, via commonjs require or via ES import.
In this case we will use the import via the global `window`.

Alternative import styles:
"commonjs" import style
const Onfido = require('../index.js')
"es" import style
import * as Onfido from '../index.js'
*/

const Onfido = window.Onfido

let port2 = null
let regionCode = null
let url = null
let defaultRegion = 'EU'

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

const getTokenFactoryUrl = (region) => {
  switch (region) {
    case 'US':
      return process.env.US_JWT_FACTORY
    case 'CA':
      return process.env.CA_JWT_FACTORY
    default:
      return process.env.JWT_FACTORY
  }
}

const getToken = (hasPreview, regionFromPreviewer='', onSuccess) => {
  regionCode = (queryParamToValueString.region || regionFromPreviewer || defaultRegion).toUpperCase()
  url = getTokenFactoryUrl(regionCode)
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.setRequestHeader('Authorization', 'BASIC ' + process.env.SDK_TOKEN_FACTORY_SECRET)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      if (hasPreview) {
        port2.postMessage({
          type: 'UPDATE_CHECK_DATA',
          payload: {
            applicantId: data.applicant_id
          }
        })
      }
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
    if (!options.mobileFlow) {
      console.log('* JWT Factory URL:', url, 'for', regionCode, 'in', process.env.NODE_ENV)
    }
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
  constructor(props) {
    super(props)
    this.state = {
      token: false,
      isModalOpen: false
    }
    this.callTokenFactory()
  }

  componentDidUpdate(prevProps) {
    const {region} = this.props.sdkOptions || {}
    const prevPreviewerOptions = prevProps.sdkOptions || {}
    if (prevPreviewerOptions.region === region) return
    this.callTokenFactory()
  }

  callTokenFactory = () => {
    const {region} = this.props.sdkOptions || {}
    getToken(this.props.hasPreview, region, (token) => {
      this.setState({token})
    })
  }

  render () {
    const {tearDown} = this.props.viewOptions || {}

    if (tearDown) return "SDK has been torn down"

    const options = {
      ...getInitSdkOptions(),
      ...this.state,
      onComplete: data => this.props.hasPreview ? port2.postMessage({ type: 'SDK_COMPLETE', data }) : console.log(data),
      onError: error => console.error("onError callback:", error),
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
      {queryParamToValueString.async === 'false' && this.state.token === null ?
        null : <SDK options={options}/>
      }
    </div>
  }
}

const rootNode = document.getElementById('demo-app')

let container;
window.addEventListener('message', event => {
  if (event.data === 'init' && !port2) {
    port2 = event.ports[0]
    port2.onmessage = onMessage
  }
})

const onMessage = () => {
  if (event.data.type === 'RENDER') {
    container = render(
      <Demo {...event.data.options} hasPreview={true} />,
      rootNode,
      container
    )
  }
  else if (event.data.type === 'SDK_COMPLETE') {
    console.log("everything is complete", event.data.data)
  }
}

if (window.location.pathname === '/') {
  container = render(
    <Demo />,
    rootNode,
    container
  )
}
else {
  window.parent.postMessage('RENDER_DEMO_READY', '*')
}
