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

import classNames from 'classnames'
import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType, CameraStateType} from './CameraTypes'
import { checkIfWebcamPermissionGranted, parseTags } from '../utils'

export const CameraActions = ({children}: CameraActionType) => {
  return (
    <div className={style.captureActions}>
      {children}
    </div>
  )
}

type CameraErrorType = {
  onUploadFallback: File => void,
  fileInput?: React.Ref<'input'>,
  trackScreen: Function,
  i18n: Object,
  cameraError: Object,
  cameraErrorRenderAction?: void => React.Node,
  cameraErrorHasBackdrop?: boolean,
}

class CameraError extends React.Component<CameraErrorType> {
  fileInput = null

  componentDidMount () {
    if (this.props.cameraError.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  handleFallback = (event) => {
    if (this.fileInput) { this.props.onUploadFallback(this.fileInput.files[0]) }
    // Remove target value to allow upload of the same file if needed
    event.target.value = null
  }

  onFallbackClick = () => {
    if (this.fileInput) { this.fileInput.click(); }
    if (this.props.cameraError.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  errorInstructions = (text) =>
    <span onClick={this.onFallbackClick} className={style.errorLink}>
      { text }
      <input type="file" accept='image/*' capture
        ref={(ref) => this.fileInput = ref} style={'display: none'}
        onChange={this.handleFallback}
      />
    </span>

  render = () => {
    const { cameraError, cameraErrorHasBackdrop, cameraErrorRenderAction } = this.props
    return (
      <div className={classNames(style.errorContainer, style[`${cameraError.type}ContainerType`], { //`
        [style.errorHasBackdrop]: cameraErrorHasBackdrop,
      })}>
        <Error
          i18n={this.props.i18n}
          className={style.errorMessage}
          error={cameraError}
          renderAction={cameraErrorRenderAction}
          renderInstruction={ str =>
            parseTags(str, ({text}) => this.errorInstructions(text))}
          smaller
        />
      </div>
    )
  }
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.

export const CameraPure = ({method, title, subTitle, onUploadFallback, hasError,
                            onUserMedia, onFailure, webcamRef, isFullScreen, i18n,
                            isWithoutHole, className, video,
                            trackScreen, cameraError, cameraErrorRenderAction,
                            cameraErrorHasBackdrop}: CameraPureType) => (

  <div className={classNames(style.camera, className)}>
    <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
    <div className={classNames(style.container,
      {[style.fullScreenContainer]: isFullScreen,
        [style.nonFullScreenContainer]: !isFullScreen})}>
      {
        hasError ?
          <CameraError {...{
            cameraError, cameraErrorRenderAction, cameraErrorHasBackdrop,
            onUploadFallback, i18n, trackScreen
          }}/> :
          null
      }
      <Webcam
        className={style.video}
        audio={!!video}
        height={720}
        facingMode={"user"}
        {...{onUserMedia, ref: webcamRef, onFailure}}
      />
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
    return process.env.LIVENESS_ENABLED && this.props.variant === 'video' ?
      <Liveness {...props} /> :
      <Photo {...props} />
  }

  handleUserMedia = () => {
    this.setState({ hasGrantedPermission: true })
  }

  handleWebcamFailure = (error: Error) => {
    if (permissionErrors.includes(error.name)) {
      this.setState({ hasGrantedPermission: false })
    } else {
      this.setState({ hasError: true, cameraError: { name: 'CAMERA_NOT_WORKING', type: 'error' }})
    }
    this.props.onFailure()
  }

  reload = () => window.location.reload()

  render = () => {
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state
    return (
      hasGrantedPermission === false ?
        <PermissionsRecover {...this.props} onRefresh={this.reload} /> :
        (hasGrantedPermission || hasSeenPermissionsPrimer) ?
          this.renderCamera() :
          <PermissionsPrimer
            {...this.props}
            onNext={this.setPermissionsPrimerSeen}
          />
    )
  }
}
