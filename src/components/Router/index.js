import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import MasterFlow from './MasterFlow'
import CrossDeviceFlow from './CrossDeviceFlow'

const history = createHistory()

import { unboundActions } from '../../core'

const Router = (props) =>
    props.options.mobileFlow ?
      <MobileRouter {...props}/> : <DesktopRouter {...props}/>

class MobileRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: null,
      steps: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      roomId: window.location.pathname.substring(1),
    }
    this.state.socket.on('config', this.setConfig(props.actions))
    this.state.socket.emit('join', {room: this.state.roomId})
    this.requestConfig()
  }

  requestConfig = () => {
    this.state.socket.emit('message', {room: this.state.roomId, event: 'get config'})
  }

  setConfig = (actions) => {
    return (data) => {
      const {token, steps, documentType, step} = data
      this.setState({token, steps, step})
      actions.setDocumentType(documentType)
    }
  }

  render = (props) =>
      this.state.token ?
        <MasterFlow {...props} {...this.state}/> : <p>LOADING</p>
}

class DesktopRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roomId: null,
      socket: io(process.env.DESKTOP_SYNC_URL),
      mobileConnected: false,
      startCrossDevice: false,
      flow: 'master',
      step: this.props.step || 0,
    }

    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
    })

    this.state.socket.on('joined', this.setRoomId)
    this.state.socket.on('get config', this.sendConfig)
    this.state.socket.emit('join', {})
  }

  setRoomId = (data) => {
    this.setState({roomId: data.roomId})
  }

  sendConfig = () => {
    const {documentType, options} = this.props
    const {steps, token} = options
    const config = {steps, token, documentType, step: this.state.step}
    this.state.socket.emit('message', {room: this.state.roomId, event: 'config', payload: config})
    this.setState({mobileConnected: true})
  }

  onStepChange = (step) => {
    this.setState({step})
  }

  pushHistory = (path, state) => {
    history.push(path, state)
  }

  startCrossDevice = () => {
    this.setState({startCrossDevice: true, step: 0, flow: 'crossDevice'})
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render = (props) => {
    // TODO this URL should point to where we host the mobile flow
    const mobileUrl = `${document.location.origin}/${this.state.roomId}?mobileFlow=true`
    return (
      this.state.startCrossDevice ?
        <CrossDeviceFlow step={this.state.step} mobileUrl={mobileUrl} pushHistory={this.pushHistory} onStepChange={this.onStepChange}/> :
        <MasterFlow {...props} step={this.state.step} onStepChange={this.onStepChange} startCrossDevice={this.startCrossDevice} pushHistory={this.pushHistory} />
    )
  }
}

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
