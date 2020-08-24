import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import CrossDeviceSubmit from './CrossDeviceSubmit'
import MobileNotificationSent from './MobileNotificationSent'

class MobileFlow extends Component {
  componentDidMount() {
    this.props.socket.on('disconnect ping', this.onDisconnectPing)
    this.props.socket.on('get config', this.sendConfig)
    this.props.socket.on('client success', this.onClientSuccess)
    this.props.socket.on('user analytics', this.onUserAnalyticsEvent)
    this.props.socket.on('cross device start', this.onCrossBrowserStart)
  }

  componentWillUnmount() {
    this.props.socket.off('disconnect ping')
    this.props.socket.off('get config')
    this.props.socket.off('client success')
    this.props.socket.off('user analytics')
    const { socket, roomId, actions } = this.props
    socket.emit('disconnecting', { roomId })
    this.props.socket.off('cross device start')
    actions.mobileConnected(false)
  }

  sendConfig = (data) => {
    const { roomId, mobileConfig, socket, actions } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', { roomId })
    }
    actions.setRoomId(data.roomId)
    actions.mobileConnected(true)
    this.sendMessage('config', data.roomId, mobileConfig)
  }

  sendMessage = (event, roomId, payload) => {
    this.props.socket.emit('message', { event, payload, roomId })
  }

  // prettier-ignore
  onClientSuccess = (data) => {
    (data.captures || []).forEach((capture) =>
      this.props.actions.createCapture(capture)
    )

    this.props.actions.setClientSuccess(true)
  }

  onCrossBrowserStart = () => {
    dispatchEvent(
      new CustomEvent('userAnalyticsEvent', {
        detail: {
          eventName: 'CROSS_DEVICE_START',
          isCrossDevice: true,
        },
      })
    )
  }

  onUserAnalyticsEvent = (data) => {
    dispatchEvent(new CustomEvent('userAnalyticsEvent', data))
  }

  onDisconnectPing = (data) => {
    this.sendMessage('disconnect pong', data.roomId)
  }

  render = (props) => {
    if (this.props.clientSuccess) return <CrossDeviceSubmit {...props} />
    return this.props.mobileConnected ? (
      <MobileConnected {...props} />
    ) : (
      <MobileNotificationSent {...props} />
    )
  }
}

export default MobileFlow
