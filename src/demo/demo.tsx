import { h, render, FunctionComponent } from 'preact'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { queryParamToValueString } from './demoUtils'
import SdkDemo from './SdkDemo'

const Header: FunctionComponent = () => <h1>Onfido SDK UI Demo</h1>

const Step1: FunctionComponent = () => (
  <div>
    <p className="qa-first-step-text">This is the first step</p>
    <Link to="/dummy-step-2">
      <button type="button" className="qa-step-two-btn">
        Start
      </button>
    </Link>
  </div>
)

const Step2: FunctionComponent = () => (
  <div>
    <p className="qa-second-step-text">
      This is a dummy step added to the demo app history
    </p>
    <Link to="/id-verification">
      <button type="button" className="qa-start-verification-btn">
        Go to SDK
      </button>
    </Link>
  </div>
)

const DummyHostApp: FunctionComponent = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={Step1} />
    <Route path="/dummy-step-2" component={Step2} />
    <Route path="/id-verification" component={SdkDemo} />
  </div>
)

const renderDemoApp = () => {
  let messagePort: MessagePort

  const rootNode = document.getElementById('demo-app')

  if (!rootNode) {
    throw new Error('Element #demo-app not found!')
  }

  const { useHistory } = queryParamToValueString

  const onMessage = (event: MessageEvent) => {
    if (event.data.type === 'RENDER') {
      render(
        <SdkDemo
          {...event.data.options}
          hasPreview={true}
          messagePort={messagePort}
        />,
        rootNode
      )
    } else if (event.data.type === 'SDK_COMPLETE') {
      console.log('everything is complete', event.data.data)
    }
  }

  window.addEventListener('message', (event) => {
    if (event.data === 'init' && !messagePort) {
      messagePort = event.ports[0]
      messagePort.onmessage = onMessage
    }
  })

  console.log('public path: ', process.env.PUBLIC_PATH)
  console.log('location pathname: ', window.location.pathname)

  if (window.location.pathname === process.env.PUBLIC_PATH) {
    render(
      useHistory ? (
        <Router>
          <DummyHostApp />
        </Router>
      ) : (
        // tsc complains: Variable 'messagePort' is used before being assigned.
        // @ts-ignore
        <SdkDemo messagePort={messagePort} />
      ),
      rootNode
    )
  } else {
    window.parent.postMessage('RENDER_DEMO_READY', '*')
  }
}

renderDemoApp()

export { SdkDemo }
