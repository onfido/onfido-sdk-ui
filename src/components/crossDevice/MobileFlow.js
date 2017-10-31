import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import CrossDeviceSubmit from './CrossDeviceSubmit'
import MobileNotificationSent from './MobileNotificationSent'

class MobileFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {showMobileNotification: false}
  }

  componentDidMount() {
    this.props.socket.on('get config', this.sendConfig)
    this.props.socket.on('clientSuccess', this.onClientSuccess)
  }

  componentWillReceiveProps(props) {
    this.setState({showMobileNotification: !!props.mobileNumber})
  }

  componentWillUnmount() {
    this.props.socket.off('get config')
    this.props.socket.off('clientSuccess')
    const {socket, roomId} = this.props
    socket.emit('disconnecting', {roomId})
  }

  sendConfig = (data) => {
    const { roomId, mobileConfig, socket, actions } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    actions.setRoomId(data.roomId)
    this.sendMessage('config', mobileConfig, data.roomId)
    this.setState({showMobileNotification: false})
  }

  sendMessage = (event, payload, roomId) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  onClientSuccess = () => {
    this.props.actions.setClientSuccess(true)
  }

  render = (props) => {
    return this.props.clientSuccess ?
      <CrossDeviceSubmit {...props}/> :
      this.state.showMobileNotification ?
        <MobileNotificationSent {...props}/> :
        <MobileConnected {...props}/>
      }
}

export default MobileFlow
