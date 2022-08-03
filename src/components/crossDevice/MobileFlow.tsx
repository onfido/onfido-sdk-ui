import { h, Component, ComponentType } from 'preact'
import MobileConnected from './MobileConnected'
import CrossDeviceSubmit from './CrossDeviceSubmit'
import MobileNotificationSent from './MobileNotificationSent'
import { MobileConfig } from '~types/commons'
import { UserAnalyticsEventDetail } from '~types/tracker'
import { FaceCapture, DocumentCapture } from '~types/redux/captures'
import {
  CompleteStepValue,
  ReduxProps,
  StepComponentProps,
} from '~types/routers'

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
    docPayload: CompleteStepValue
  }) => {
    const captures = data.captures || []
    captures.forEach((capture) => this.props.actions.createCapture(capture))

    this.props.completeStep(data.docPayload)

    // With workflow, the step is already finished on mobile, so we go directly to the next step
    if (this.props.useWorkflow) {
      this.props.nextStep()
    } else {
      this.props.actions.setClientSuccess(true)
    }
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
      <MobileNotificationSent {...this.props} />
    )
  }
}

export default MobileFlow as ComponentType<StepComponentProps>
