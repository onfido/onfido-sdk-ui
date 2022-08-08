import { h, Component, ComponentType } from 'preact'
import { WebcamProps } from '~webcam/react-webcam'
import PermissionsPrimer from '../CameraPermissions/Primer'
import PermissionsRecover from '../CameraPermissions/Recover'

import { checkIfWebcamPermissionGranted } from '~utils'

import type { WithTrackingProps, WithPermissionsFlowProps } from '~types/hocs'

const permissionErrors = [
  'PermissionDeniedError',
  'NotAllowedError',
  'NotFoundError',
] as const

export type PermissionError = typeof permissionErrors[number]

type Props = WebcamProps & WithTrackingProps & WithPermissionsFlowProps

type State = {
  hasGrantedPermission: boolean | null
  hasSeenPermissionsPrimer: boolean
  checkingWebcamPermissions: boolean
}

export default <P extends Props>(
  WrappedCamera: ComponentType<P>
): ComponentType<P> =>
  class WithPermissionFlow extends Component<P, State> {
    state: State = {
      hasGrantedPermission: null,
      hasSeenPermissionsPrimer: false,
      checkingWebcamPermissions: true,
    }

    componentDidMount() {
      checkIfWebcamPermissionGranted((value) =>
        this.setState({
          checkingWebcamPermissions: false,
          hasGrantedPermission: value || null,
        })
      )
    }

    setPermissionsPrimerSeen = () => {
      this.props.trackScreen('camera_access_allow_button_clicked')
      this.setState({ hasSeenPermissionsPrimer: true })
    }

    handleUserMedia = () => {
      this.setState({ hasGrantedPermission: true })
      this.props.onUserMedia && this.props.onUserMedia()
    }

    handleWebcamFailure = (error?: Error) => {
      if (error && permissionErrors.includes(error.name as PermissionError)) {
        this.setState({ hasGrantedPermission: false })
      } else {
        this.props.onFailure && this.props.onFailure()
      }
    }

    render() {
      const {
        hasSeenPermissionsPrimer,
        hasGrantedPermission,
        checkingWebcamPermissions,
      } = this.state
      const { trackScreen, audio } = this.props

      // while checking if we have permission or not, don't render anything
      // otherwise we'll see a flicker, after we do work out what's what
      if (checkingWebcamPermissions) return null

      if (hasGrantedPermission === false) {
        return <PermissionsRecover {...{ trackScreen, audio }} />
      }

      if (hasGrantedPermission || hasSeenPermissionsPrimer) {
        return (
          <WrappedCamera
            {...this.props}
            hasGrantedPermission={hasGrantedPermission}
            onUserMedia={this.handleUserMedia}
            onFailure={this.handleWebcamFailure}
          />
        )
      }

      return (
        <PermissionsPrimer
          {...{ trackScreen, audio }}
          onNext={this.setPermissionsPrimerSeen}
        />
      )
    }
  }
