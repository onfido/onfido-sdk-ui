import { h, render, Component } from 'preact'
import { shallowEquals } from '~utils/object'
import { getInitSdkOptions } from './demoUtils'
import { SdkOptions, ViewOptions, CheckData } from './SidebarSections'

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}


class Previewer extends Component {
  state = {
    viewOptions: {
      darkBackground: false,
      iframeWidth: '100%',
      iframeHeight: '100%',
      containerWidth: '100%',
      containerHeight: '100%',
      tearDown: false,
      rootFontSize: '16px',
      containerFontSize: '16px'
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
    )
      this.renderDemoApp()
  }

  onMessage = message => {
    if (message.data.type === 'render_demo_ready')
      this.renderDemoApp()
    else if (message.data.type === 'update_check_data')
      this.setState(prevState => ({
        checkData: {
          ...prevState.checkData,
          ...message.data.payload
        }
      }))
    else if (message.data.type === 'sdk_complete') {
      this.setState({ sdkFlowCompleted: true })
      if (this.globalOnCompleteFunc) this.globalOnCompleteFunc(message.data.data)
      console.log('Complete with data!', message.data.data)
    }
  }

  renderDemoApp = () => this.iframe.contentWindow.postMessage({
    type: 'render',
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

  render() {
    return (
      <div class="previewer">
        <div class={'iframe-wrapper' + (this.state.viewOptions.darkBackground ? ' dark' : '')}>
          <iframe
            src={`./demo.html${window.location.search}`}
            ref={iframe => this.iframe = iframe}
            style={{
              width: this.state.viewOptions.iframeWidth,
              height: this.state.viewOptions.iframeHeight
            }}
          />
        </div>
        <div class="sidebar">
          <a href="./demo.html">(view vanilla SDK demo page)</a>

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
