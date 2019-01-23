import { h, render, Component } from 'preact'
import URLSearchParams from 'url-search-params'
import { getInitSdkOptions } from './demoUtils'

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

/*
Importing index.js would work, but it would mean we would be bundling all that code into this demo bundle. Therefore we wouldn't be testing as
close to production as with this approach. This approach will actually
use the onfido bundle, the one that clients will use as well.
 */
const Onfido = window.Onfido

const getToken = function(onSuccess) {
  const url = process.env.JWT_FACTORY
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      window.parent.postMessage({
        type: 'update_check_data',
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
      onComplete: data => window.parent.postMessage({ type: 'sdk_complete', data }),
      onModalRequestClose: () => this.setState({ isModalOpen: false }),
      ...(this.props.sdkOptions || {})
    }

    const searchParams = new URLSearchParams(window.location.search)

    return <div class="container">
      {options.useModal &&
        <button
          id="button"
          onClick={ () => this.setState({isModalOpen: true})}>
            Verify identity
        </button>
      }
      {searchParams.get('async') === 'false' && this.state.token === null ?
        null : <SDK options={options}></SDK>
      }
    </div>
  }
}


const rootNode = document.getElementById('demo-app')

let container;
window.addEventListener('message', message => {
  if (message.data.type === 'render')
    container = render(
      <Demo {...message.data.options} />,
      rootNode,
      container
    )
  else if (message.data.type === 'sdk_complete')
    console.log("everything is complete", message.data.data)
})

if (window.parent === window) {
  // if we have no parent, then we tell ourselves to render straight away!
  window.postMessage({ type: 'render' })
}
else
  window.parent.postMessage({ type: 'render_demo_ready' })
