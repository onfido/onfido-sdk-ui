import { h, render, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import {
  UIConfigs,
  getInitSdkOptions,
  queryParamToValueString,
  getTokenFactoryUrl,
  getToken,
} from './demoUtils'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { ServerRegions, SdkHandle, SdkOptions } from '~types/sdk'

/*
The SDK can be consumed either via npm or via global window.
Via npm there are also two ways, via commonjs require or via ES import.
In this case we will use the import via the global `window`.

Alternative import styles:
"commonjs" import style
const Onfido = require('../index')
"es" import style
import * as Onfido from '../index'
*/

const Onfido = window.Onfido

let port2: MessagePort = null
let regionCode: ServerRegions = null
let url: string = null
const defaultRegion: ServerRegions = 'EU'

const SdkMount: FunctionComponent<{
  options: SdkOptions | UIConfigs
}> = ({ options }) => {
  const [onfidoSdk, setOnfidoSdk] = useState<SdkHandle>(null)
  const mountEl = useRef(null)

  /**
   * This side effect should run once after the component mounted,
   * and should execute the clean-up function when the component unmounts.
   */
  useEffect(() => {
    if (!(options as SdkOptions).mobileFlow) {
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
  }, [])

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

const SdkDemo: FunctionComponent<{
  hasPreview?: boolean
  sdkOptions?: SdkOptions
  viewOptions?: UIConfigs
}> = ({ hasPreview = false, sdkOptions, viewOptions }) => {
  const [token, setToken] = useState<string>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const callTokenFactory = useCallback(() => {
    const { region } = sdkOptions || {}

    regionCode = (
      queryParamToValueString.region ||
      region ||
      defaultRegion
    ).toUpperCase() as ServerRegions

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

  const options: SdkOptions = {
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
  const { useHistory } = queryParamToValueString

  const onMessage = (event: MessageEvent) => {
    if (event.data.type === 'RENDER') {
      render(<Demo {...event.data.options} hasPreview={true} />, rootNode)
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
    render(
      useHistory ? (
        <Router>
          <DummyHostApp />
        </Router>
      ) : (
        <Demo />
      ),
      rootNode
    )
  } else {
    window.parent.postMessage('RENDER_DEMO_READY', '*')
  }
}

renderDemoApp()
