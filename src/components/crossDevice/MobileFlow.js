import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import MobileComplete from './MobileComplete'

class MobileFlow extends Component {
  componentDidMount() {
    this.props.socket.on('get config', this.sendConfig)
    this.props.socket.on('complete', this.onMobileComplete)
  }

  componentWillUnmount() {
    this.props.socket.off('get config')
    this.props.socket.off('complete')
  }

  sendConfig = (data) => {
    if (this.props.roomId && this.props.roomId !== data.roomId) {
      this.props.socket.emit('leave', {roomId: this.props.roomId})
    }
    this.props.actions.setRoomId(data.roomId)
    this.sendMessage('config', this.props.mobileConfig, data.roomId)
  }

  sendMessage = (event, payload, roomId) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  onMobileComplete = () => {
    this.props.actions.setMobileComplete(true)
  }

  render = (props) =>
    this.props.mobileComplete ?
      <MobileComplete/> : <MobileConnected back={props.back}/>
}

export default MobileFlow
