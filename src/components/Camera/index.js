// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'

import { Overlay } from '../Overlay'
import Title from '../Title'
import Error from '../Error'
import AutoCapture from './AutoCapture'
import Photo from './Photo'
import Liveness from '../Liveness'
import PermissionsPrimer from './Permissions/Primer'
import PermissionsRecover from './Permissions/Recover'
import CustomFileInput from '../CustomFileInput'
import { isDesktop } from '../utils'
import classNames from 'classnames'
import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType, CameraStateType, FlowNameType } from './CameraTypes'
import { checkIfWebcamPermissionGranted, parseTags } from '../utils'

export const CameraActions = ({children}: CameraActionType) => {
  return (
    <div className={style.captureActions}>
      {children}
    </div>
  )
}

type CameraErrorType = {
  changeFlowTo: FlowNameType => void,
  onUploadFallback: File => void,
  trackScreen: Function,
  method: string,
  cameraError: Object,
  cameraErrorFallback?: string => React.Node,
  cameraErrorHasBackdrop?: boolean,
}

class CameraError extends React.Component<CameraErrorType> {

  componentDidMount () {
    if (this.props.cameraError.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  handleFileInputClick = () => {
    if (this.props.cameraError.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  basicCameraFallback = (text: string) =>
    <CustomFileInput
      className={style.fallbackLink}
      onChange={this.props.onUploadFallback}
      onClick={this.handleFileInputClick}
      accept="image/*"
      capture={ this.props.method === 'face' ? 'user' : true }
    >
      { text }
    </CustomFileInput>

  crossDeviceFallback = (text: string) =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps')} className={style.fallbackLink}>
      {text}
    </span>

  defaultFallback = isDesktop ? this.crossDeviceFallback : this.basicCameraFallback

  render = () => {
    const {
      cameraError, cameraErrorHasBackdrop,
      cameraErrorFallback = this.defaultFallback,
    } = this.props
    return (
      <div className={classNames(style.errorContainer, style[`${cameraError.type}ContainerType`], {
        [style.errorHasBackdrop]: cameraErrorHasBackdrop,
      })}>
        <Error
          className={style.errorMessage}
          error={cameraError}
          renderInstruction={ str => parseTags(str, ({text}) => cameraErrorFallback(text)) }
        />
      </div>
    )
  }
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.

export const CameraPure = ({method, title, subTitle, onUploadFallback, hasError,
                            onUserMedia, onFailure, webcamRef, isFullScreen,
                            isWithoutHole, className, video, changeFlowTo,
                            trackScreen, cameraError, cameraErrorFallback,
                            cameraErrorHasBackdrop}: CameraPureType) => (

  <div className={classNames(style.camera, className)}>
    <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
    <div className={classNames(style.container,
      {[style.fullScreenContainer]: isFullScreen,
        [style.autoCaptureContainer]: !isFullScreen})}>
      {
        hasError ?
          <CameraError {...{
            cameraError, cameraErrorHasBackdrop, cameraErrorFallback,
            onUploadFallback, trackScreen, changeFlowTo, method,
          }}/> :
          null
      }
      <div className={style.webcamContainer}><Webcam
        className={style.video}
        audio={!!video}
        height={720}
        facingMode={"user"}
        {...{onUserMedia, ref: webcamRef, onFailure}}
      /></div>
      <Overlay {...{method, isFullScreen, isWithoutHole}} />
    </div>
  </div>
)

const permissionErrors = ['PermissionDeniedError', 'NotAllowedError', 'NotFoundError']

export default class Camera extends React.Component<CameraType, CameraStateType> {
  webcam: ?React$ElementRef<typeof Webcam> = null

  static defaultProps = {
    onFailure: () => {},
    useFullScreen: () => {},
  }

  state: CameraStateType = {
    hasError: false,
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

  renderCamera = () => {
    const props = {
      ...this.props,
      onUserMedia: this.handleUserMedia,
      onFailure: this.handleWebcamFailure,
      hasError: this.state.hasError,
      cameraError: this.state.cameraError,
      hasGrantedPermission: this.state.hasGrantedPermission,
    }

    if (this.props.autoCapture) return <AutoCapture {...props} />
    return this.props.liveness ?
      <Liveness {...props} /> :
      <Photo {...props} />
  }

  handleUserMedia = () => {
    this.setState({ hasGrantedPermission: true })
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
    const { trackScreen } = this.props
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state
    return (
      hasGrantedPermission === false ?
        <PermissionsRecover trackScreen={trackScreen} onRefresh={this.reload} /> :
        (hasGrantedPermission || hasSeenPermissionsPrimer) ?
          this.renderCamera() :
          <PermissionsPrimer trackScreen={trackScreen} onNext={this.setPermissionsPrimerSeen} />
    )
  }
}
