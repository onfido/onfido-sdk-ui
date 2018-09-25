// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import Camera from './index'
import type { CameraPureType, CameraType, CameraActionType, CameraStateType, FlowNameType } from './CameraTypes'
import PermissionsPrimer from './Permissions/Primer'
import PermissionsRecover from './Permissions/Recover'
import { checkIfWebcamPermissionGranted  } from '../utils'

const permissionErrors = ['PermissionDeniedError', 'NotAllowedError', 'NotFoundError']

export default class CameraFlow extends React.Component<CameraType, CameraStateType> {
  webcam: ?React$ElementRef<typeof Webcam> = null

  static defaultProps = {
    onFailure: () => {},
    useFullScreen: () => {},
  }

  state: CameraStateType = {
    hasError: false,
    hasMediaStream: false,
    hasGrantedPermission: undefined,
    hasSeenPermissionsPrimer: false,
    cameraError: {},
  }

  componentDidMount () {
    this.props.trackScreen('camera')
    checkIfWebcamPermissionGranted(hasGrantedPermission =>
      this.setState({ hasGrantedPermission: hasGrantedPermission || undefined }))
    this.useFullScreenIfNeeded()
  }

  componentDidUpdate(prevProps: CameraType, prevState: CameraStateType) {
    if (prevState.hasGrantedPermission !== this.state.hasGrantedPermission ||
        prevState.hasSeenPermissionsPrimer !== this.state.hasSeenPermissionsPrimer
    ) {
      this.useFullScreenIfNeeded()
    }
  }

  componentWillUnmount() {
    this.props.useFullScreen(false)
  }

  useFullScreenIfNeeded() {
    const { method } = this.props
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state
    const needsFullScreen = method === 'face' &&
                            hasGrantedPermission !== false &&
                            (hasGrantedPermission || hasSeenPermissionsPrimer)
    this.props.useFullScreen(needsFullScreen)
  }

  setPermissionsPrimerSeen = () => {
    this.setState({ hasSeenPermissionsPrimer: true })
  }

  handleUserMedia = () => {
    this.setState({ hasGrantedPermission: true, hasMediaStream: true })
  }

  handleWebcamFailure = (error: Error) => {
    // $FlowFixMe
    if (Array.includes(permissionErrors, error.name)) {
      this.setState({ hasGrantedPermission: false })
    } else {
      this.setState({ hasError: true, cameraError: { name: 'CAMERA_NOT_WORKING', type: 'error' }})
    }
    this.props.onFailure()
  }

  reload = () => window.location.reload()

  render = () => {
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state
    return hasGrantedPermission === false ? 
      <PermissionsRecover {...this.props} onRefresh={this.reload} /> : (
      <Flow name="camera">
      {
        hasSeenPermissionsPrimer !== true ?
          <Step>
            <PermissionsPrimer
              {...this.props}
              onNext={this.setPermissionsPrimerSeen}
            />
          </Step> :
          null
      }
        <Step>
          <Camera {...{
            ...this.props,
            onUserMedia: this.handleUserMedia,
            onFailure: this.handleWebcamFailure,
            hasError: this.state.hasError,
            hasMediaStream: this.state.hasMediaStream,
            cameraError: this.state.cameraError,
            hasGrantedPermission: this.state.hasGrantedPermission,
          }} />
        </Step>
      </Flow>
    )
  }
}
