import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import CrossDeviceSubmit from './CrossDeviceSubmit'

class MobileFlow extends Component {
  componentDidMount() {
    this.props.socket.on('get config', this.sendConfig)
    this.props.socket.on('clientSuccess', this.onClientSuccess)
  }

  componentWillUnmount() {
    this.props.socket.off('get config')
    this.props.socket.off('clientSuccess')
  }

  sendConfig = (data) => {
    const { roomId, mobileConfig, socket, actions } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    actions.setRoomId(data.roomId)
    this.sendMessage('config', mobileConfig, data.roomId)
  }

  sendMessage = (event, payload, roomId) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  onClientSuccess = () => {
    this.props.actions.setClientSuccess(true)
  }

  render = (props) =>
    this.props.clientSuccess ?
      <CrossDeviceSubmit {...props}/> : <MobileConnected {...props}/>
}

export default MobileFlow
