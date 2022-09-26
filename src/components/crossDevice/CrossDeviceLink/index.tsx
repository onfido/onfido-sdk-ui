import { h, Component, ComponentType } from 'preact'
import { createSocket } from '~utils/crossDeviceSync'
import Spinner from '../../Spinner'
import { trackComponent } from '../../../Tracker'
import { localised } from '~locales'
import { MobileConfig } from '~types/commons'
import {
  StepComponentDocumentProps,
  StepComponentProps,
  StepsRouterProps,
} from '~types/routers'
import CrossDeviceLinkUI from './CrossDeviceLinkUI'
import { SdkOptions } from '~types/sdk'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

export type CrossDeviceLinkProps = {
  roomId: string
  mobileConfig: MobileConfig
  nextStep: StepsRouterProps['nextStep']
} & WithTrackingProps &
  WithLocalisedProps &
  MobileConfig &
  StepComponentDocumentProps &
  SdkOptions

class CrossDeviceLink extends Component<CrossDeviceLinkProps> {
  constructor(props: CrossDeviceLinkProps) {
    super(props)

    if (!props.socket) {
      const url = props.urls.sync_url
      const socket = createSocket(url)
      socket.on('connect', () => {
        const roomId = this.props.roomId || null
        socket.emit('join', { roomId })
      })
      socket.on('joined', this.onJoined)
      socket.open()
      props.actions.setSocket(socket)
    }
  }

  componentDidMount() {
    this.listen(this.props.socket)
  }

  componentWillReceiveProps(nextProps: CrossDeviceLinkProps) {
    if (nextProps.socket !== this.props.socket) {
      this.unlisten(this.props.socket)
      this.listen(nextProps.socket)
    }
  }

  componentWillUnmount() {
    this.unlisten(this.props.socket)
  }

  unlisten = (socket: StepComponentProps['socket']) => {
    if (!socket) return
    socket.off('get config', this.onGetConfig)
    socket.off('client success', this.onClientSuccess)
  }

  listen = (socket: StepComponentProps['socket']) => {
    if (!socket) return
    socket.on('get config', this.onGetConfig)
    socket.on('client success', this.onClientSuccess)
  }

  onJoined = (data: { roomId: string }) => {
    const { actions, roomId } = this.props
    if (!roomId) {
      actions.setRoomId(data.roomId)
    }
  }

  onGetConfig = (data: { roomId: string }) => {
    const { roomId, mobileConfig, socket, actions, nextStep } = this.props
    if (roomId && roomId !== data.roomId && socket) {
      socket.emit('leave', { roomId })
    }
    actions.mobileConnected(true)
    this.sendMessage('config', data.roomId, mobileConfig)
    nextStep()
  }

  onClientSuccess = () => {
    const { actions } = this.props
    actions.setClientSuccess(true)
    this.props.nextStep()
  }

  sendMessage = (event: string, roomId: string, payload?: MobileConfig) => {
    const { socket } = this.props
    if (socket) {
      socket.emit('message', { event, payload, roomId })
    }
  }

  render = () =>
    this.props.roomId ? <CrossDeviceLinkUI {...this.props} /> : <Spinner />
}

export default trackComponent(
  localised(CrossDeviceLink),
  'crossdevice_link'
) as ComponentType<StepComponentProps>
