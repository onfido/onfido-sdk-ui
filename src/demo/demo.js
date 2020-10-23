import { h, render, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import {
  getInitSdkOptions,
  queryParamToValueString,
  getTokenFactoryUrl,
  getToken,
} from './demoUtils'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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

const shouldUseHistory = queryParamToValueString.useHistory

let port2 = null
let regionCode = null
let url = null
const defaultRegion = 'EU'

class SDK extends Component {
  componentDidMount() {
    this.initSDK(this.props.options)
  }

  componentWillReceiveProps({ options }) {
    if (this.state.onfidoSdk) {
      this.state.onfidoSdk.setOptions(options)
      if (options.tearDown) {
        this.state.onfidoSdk.tearDown()
      }
    }
  }

  componentWillUnmount() {
    if (this.state.onfidoSdk) this.state.onfidoSdk.tearDown()
  }

  initSDK = (options) => {
    if (!options.mobileFlow) {
      console.log(
        '* JWT Factory URL:',
        url,
        'for',
        regionCode,
        'in',
        process.env.NODE_ENV
      )
    }
    console.log('Calling `Onfido.init` with the following options:', options)

    const onfidoSdk = Onfido.init({ ...options, containerEl: this.el })
    this.setState({ onfidoSdk })

    window.onfidoSdkHandle = onfidoSdk
  }

  shouldComponentUpdate() {
    return false
  }
  render = () => <div ref={(el) => (this.el = el)} />
}

class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      isModalOpen: false,
    }
    this.callTokenFactory()
  }

  componentDidUpdate(prevProps) {
    const { region } = this.props.sdkOptions || {}
    const prevPreviewerOptions = prevProps.sdkOptions || {}
    if (prevPreviewerOptions.region === region) return
    this.callTokenFactory()
  }

  callTokenFactory = () => {
    const { region } = this.props.sdkOptions || {}

    regionCode = (
      queryParamToValueString.region ||
      region ||
      defaultRegion
    ).toUpperCase()

    url = getTokenFactoryUrl(regionCode)

    getToken(this.props.hasPreview, url, port2, (token) => {
      this.setState({ token })
    })
  }

  render() {
    const { tearDown } = this.props.viewOptions || {}

    if (tearDown) return 'SDK has been torn down'

    const options = {
      ...getInitSdkOptions(),
      ...this.state,
      onComplete: (data) =>
        this.props.hasPreview
          ? port2.postMessage({ type: 'SDK_COMPLETE', data })
          : console.log(data),
      onError: (error) => console.error('onError callback:', error),
      onModalRequestClose: () => this.setState({ isModalOpen: false }),
      ...(this.props.sdkOptions || {}),
    }

    return (
      <div className="container">
        {options.useModal && (
          <button
            id="button"
            type="button"
            onClick={() => this.setState({ isModalOpen: true })}
          >
            Verify identity
          </button>
        )}
        {this.state.token && <SDK options={options} />}
      </div>
    )
  }
}

const rootNode = document.getElementById('demo-app')

const Header = () => <h1>Onfido SDK UI Demo</h1>

const Step1 = () => (
  <div>
    <p className="qa-first-step-text">This is the first step</p>
    <Link to="/dummy-step-2">
      <button className="qa-step-two-btn">Start</button>
    </Link>
  </div>
)

const Step2 = () => (
  <div>
    <p className="qa-second-step-text">
      This is a dummy step added to the demo app history
    </p>
    <Link to="/id-verification">
      <button className="qa-start-verification-btn">Go to SDK</button>
    </Link>
  </div>
)

const DummyHostApp = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={Step1} />
    <Route path="/dummy-step-2" component={Step2} />
    <Route path="/id-verification" component={Demo} />
  </div>
)

let container
window.addEventListener('message', (event) => {
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
  } else if (event.data.type === 'SDK_COMPLETE') {
    console.log('everything is complete', event.data.data)
  }
}

if (window.location.pathname === '/') {
  container = render(
    shouldUseHistory ? (
      <Router history={createHistory()}>
        <DummyHostApp />
      </Router>
    ) : (
      <Demo />
    ),
    rootNode,
    container
  )
} else {
  window.parent.postMessage('RENDER_DEMO_READY', '*')
}
