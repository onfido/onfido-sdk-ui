import { h, render, Component } from 'preact'
import { shallowEquals } from '~utils/object'
import { getInitSdkOptions } from './demoUtils'
import { SdkOptions, ViewOptions, CheckData } from './SidebarSections'

const channel = new MessageChannel()
const port1 = channel.port1

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

class Previewer extends Component {
  state = {
    viewOptions: {
      darkBackground: false,
      iframeWidth: '100%',
      iframeHeight: '100%',
      tearDown: false
    },
    sdkOptions: getInitSdkOptions(),
    checkData: {
      applicantId: null,
      sdkFlowCompleted: false
    }
  }

  componentDidMount() {
    window.updateOptions = this.globalUpdateOptionsCall
    window.addEventListener('message', this.onMessage)
    port1.onmessage = this.onMessage
    this.iframe.addEventListener("load", this.onIFrameLoad)
  }

  componentWillUnmount() {
    delete window.updateOptions
    delete this.globalOnCompleteFunc
    window.removeEventListener('message', this.onMessage)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !shallowEquals(prevState.viewOptions, this.state.viewOptions) ||
      !shallowEquals(prevState.sdkOptions, this.state.sdkOptions)
    ) {
      this.renderDemoApp()
    }
  }

  onMessage = message => {
    if (message.data === 'RENDER_DEMO_READY') {
      this.renderDemoApp()
    } else if (message.data.type === 'UPDATE_CHECK_DATA') {
      this.setState(prevState => ({
        checkData: {
          ...prevState.checkData,
          ...message.data.payload
        }
      }))
    } else if (message.data.type === 'SDK_COMPLETE') {
      this.setState({ sdkFlowCompleted: true })
      if (this.globalOnCompleteFunc) this.globalOnCompleteFunc(message.data.data)
      console.log('Complete with data!', message.data.data)
    }
  }

  renderDemoApp = () => port1.postMessage({
    type: 'RENDER',
    options: this.state
  })

  globalUpdateOptionsCall = ({ onComplete, ...sdkOptions }) => {
    if (onComplete) this.globalOnCompleteFunc = onComplete
    this.updateSdkOptions(sdkOptions)
  }

  updateViewOptions = options => this.setState(prevState => ({
    viewOptions: {
      ...prevState.viewOptions,
      ...options
    }
  }))

  updateSdkOptions = options => this.setState(prevState => ({
    sdkOptions: {
      ...prevState.sdkOptions,
      ...options
    }
  }))

  onIFrameLoad = () => {
    // Transfer port2 to the iframe
    this.iframe.contentWindow.postMessage('init', '*', [channel.port2]);
  }

  render() {
    return (
      <div className="previewer">
        <div className={'iframe-wrapper' + (this.state.viewOptions.darkBackground ? ' dark' : '')}>
          <iframe
            src={`/index.html${window.location.search}`}
            ref={iframe => this.iframe = iframe}
            style={{
              width: this.state.viewOptions.iframeWidth,
              height: this.state.viewOptions.iframeHeight
            }}
          />
        </div>
        <div className="sidebar">
          <a href={`/`}>(view vanilla SDK demo page)</a>

          <SdkOptions
            sdkOptions={this.state.sdkOptions}
            updateSdkOptions={this.updateSdkOptions}
          />

          <ViewOptions
            viewOptions={this.state.viewOptions}
            updateViewOptions={this.updateViewOptions}
          />

          {!this.state.sdkOptions.mobileFlow && (
            // Check data is confusing in `mobileFlow`, as we don't have the
            // applicant ID etc. correctly, we only have the `link_id` to the
            // parent room where the data _is_ stored correctly
            <CheckData
              checkData={this.state.checkData}
              sdkFlowCompleted={this.state.sdkFlowCompleted}
            />
          )}
        </div>
      </div>
    )
  }
}

const rootNode = document.getElementById('previewer-app')
render(<Previewer />, rootNode)
