import { h, Component } from 'preact'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import {componentsList} from './StepComponentMap'
import { unboundActions } from '../../core'
import Flow from './Flow'

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
      flow: 'master',
      step: this.props.step || 0,
    }

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

  nextFlow = () =>
    this.state.flow === 'master' ? 'crossDevice' : 'master'

  onStepChange = ({step, flow}) => {
    this.setState({step, flow})
  }

  render = (props) => {
    const params = {
      flow: this.state.flow,
      documentType: this.props.documentType,
      steps: this.props.options.steps
    }
    const components = componentsList(params)
    return (
      <Flow {...props}
        componentsList={components}
        flow={this.state.flow}
        nextFlow={this.nextFlow}
        step={this.state.step}
        onStepChange={this.onStepChange}
        roomId={this.state.roomId}
      />
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
