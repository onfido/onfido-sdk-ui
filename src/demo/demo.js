import { h, render } from 'preact'
import { memo } from 'preact/compat'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
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

const SdkMount = ({ options }) => {
  const [onfidoSdk, setOnfidoSdk] = useState(null)
  const mountEl = useRef(null)

  /**
   * This side effect should run once after the component mounted,
   * and should execute the clean-up function when the component unmounts.
   */
  useEffect(() => {
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

    if (mountEl.current) {
      const sdk = Onfido.init({
        ...options,
        containerEl: mountEl.current,
      })
      setOnfidoSdk(sdk)

      window.onfidoSdkHandle = sdk
    }

    return () => onfidoSdk && onfidoSdk.tearDown()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!onfidoSdk) {
      return
    }

    if (options.tearDown) {
      onfidoSdk.tearDown()
    } else {
      onfidoSdk.setOptions(options)
    }
  }, [options, onfidoSdk])

  return <div ref={mountEl} />
}

const SDK = memo(SdkMount)

const SdkDemo = ({ hasPreview, sdkOptions, viewOptions }) => {
  const [token, setToken] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const callTokenFactory = useCallback(() => {
    const { region } = sdkOptions || {}

    regionCode = (
      queryParamToValueString.region ||
      region ||
      defaultRegion
    ).toUpperCase()

    url = getTokenFactoryUrl(regionCode)

    getToken(hasPreview, url, port2, (respondedToken) =>
      setToken(respondedToken)
    )
  }, [hasPreview, sdkOptions])

  useEffect(() => {
    callTokenFactory()
  }, [callTokenFactory])

  const { tearDown } = viewOptions || {}

  if (tearDown) {
    return <span>SDK has been torn down</span>
  }

  const options = {
    ...getInitSdkOptions(),
    token,
    isModalOpen,
    onComplete: (data) =>
      hasPreview
        ? port2.postMessage({ type: 'SDK_COMPLETE', data })
        : console.log(data),
    onError: (error) => console.error('onError callback:', error),
    onModalRequestClose: () => setIsModalOpen(false),
    ...(sdkOptions || {}),
  }

  return (
    <div className="container">
      {options.useModal && (
        <button id="button" type="button" onClick={() => setIsModalOpen(true)}>
          Verify identity
        </button>
      )}
      {token && <SDK options={options} />}
    </div>
  )
}

export const Demo = memo(SdkDemo)

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

const renderDemoApp = () => {
  const rootNode = document.getElementById('demo-app')
  let container

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

  window.addEventListener('message', (event) => {
    if (event.data === 'init' && !port2) {
      port2 = event.ports[0]
      port2.onmessage = onMessage
    }
  })

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
}

renderDemoApp()
