import { h, Component } from 'preact'
import MobileConnected from './MobileConnected'
import CrossDeviceSubmit from './CrossDeviceSubmit'
import MobileNotificationSent from './MobileNotificationSent'
import { ReduxProps, StepComponentProps } from '~types/routers'
import { MobileConfig } from '~types/commons'
import { UserAnalyticsEventDetail } from '~types/tracker'
import { FaceCapture, DocumentCapture } from '~types/redux/captures'

type MobileFlowProps = {
  mobileConfig: MobileConfig
}

type Props = MobileFlowProps & ReduxProps & StepComponentProps

class MobileFlow extends Component<Props> {
  componentDidMount() {
    const { socket } = this.props
    if (socket) {
      socket.on('disconnect ping', this.onDisconnectPing)
      socket.on('get config', this.sendConfig)
      socket.on('client success', this.onClientSuccess)
      socket.on('user analytics', this.onUserAnalyticsEvent)
    }
  }

  componentWillUnmount() {
    const { actions, socket } = this.props
    if (socket) {
      socket.off('disconnect ping')
      socket.off('get config')
      socket.off('client success')
      socket.off('user analytics')
    }
    actions.mobileConnected(false)
  }

  sendConfig = (data: { roomId: string }) => {
    const { roomId, mobileConfig, socket, actions } = this.props
    if (roomId && roomId !== data.roomId && socket) {
      socket.emit('leave', { roomId })
    }
    actions.setRoomId(data.roomId)
    actions.mobileConnected(true)
    this.sendMessage('config', data.roomId, mobileConfig)
  }

  sendMessage = (event: string, roomId: string, payload?: MobileConfig) => {
    const { socket } = this.props
    if (socket) {
      socket.emit('message', { event, payload, roomId })
    }
  }

  onClientSuccess = (data: {
    roomId: string
    captures: (DocumentCapture | FaceCapture)[]
  }) => {
    const captures = data.captures || []
    captures.forEach((capture) => this.props.actions.createCapture(capture))
    this.props.actions.setClientSuccess(true)
  }

  onUserAnalyticsEvent = (data: {
    roomId: string
    detail: UserAnalyticsEventDetail
  }) => {
    const { detail } = data
    dispatchEvent(
      new CustomEvent<UserAnalyticsEventDetail>('userAnalyticsEvent', {
        detail,
      })
    )
  }

  onDisconnectPing = (data: { roomId: string }) => {
    this.sendMessage('disconnect pong', data.roomId)
  }

  render = () => {
    if (this.props.clientSuccess) return <CrossDeviceSubmit {...this.props} />
    return this.props.mobileConnected ? (
      <MobileConnected {...this.props} />
    ) : (
      <MobileNotificationSent
        {...{
          sms: this.props.sms,
          previousStep: this.props.previousStep,
          trackScreen: this.props.trackScreen,
        }}
      />
    )
  }
}

export default MobileFlow
