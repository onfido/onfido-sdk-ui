import { h, Component, ComponentType } from 'preact'
import type { WebcamProps } from 'react-webcam-onfido'
import PermissionsPrimer from '../CameraPermissions/Primer'
import PermissionsRecover from '../CameraPermissions/Recover'

import { checkIfWebcamPermissionGranted } from '~utils'

import type { CameraProps } from '~types/camera'
import type { WithTrackingProps, WithPermissionsFlowProps } from '~types/hocs'
import type { ErrorProp } from '~types/routers'

const permissionErrors = [
  'PermissionDeniedError',
  'NotAllowedError',
  'NotFoundError',
]

type Props = CameraProps &
  WebcamProps &
  WithTrackingProps &
  WithPermissionsFlowProps

type State = {
  hasGrantedPermission?: boolean
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
      this.setState({ hasSeenPermissionsPrimer: true })
    }

    handleUserMedia = () => {
      this.setState({ hasGrantedPermission: true })
      this.props.onUserMedia && this.props.onUserMedia()
    }

    handleWebcamFailure = (error: ErrorProp) => {
      if (permissionErrors.includes(error.name)) {
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
      const { trackScreen } = this.props

      // while checking if we have permission or not, don't render anything
      // otherwise we'll see a flicker, after we do work out what's what
      if (checkingWebcamPermissions) return null

      if (hasGrantedPermission === false) {
        return <PermissionsRecover {...{ trackScreen }} />
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
          {...{ trackScreen }}
          onNext={this.setPermissionsPrimerSeen}
        />
      )
    }
  }
