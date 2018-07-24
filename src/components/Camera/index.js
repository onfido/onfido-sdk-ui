// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'

import { Overlay } from '../Overlay'
import Title from '../Title'
import Error from '../Error'
import AutoCapture from './AutoCapture'
import Photo from './Photo'
import Video from './Video'
import PermissionsPrimer from './Permissions/Primer'
import PermissionsRecover from './Permissions/Recover'

import classNames from 'classnames'
import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType, CameraStateType} from './CameraTypes'
import { checkIfWebcamPermissionGranted, parseTags } from '../utils'

export const CaptureActions = ({handleClick, btnText, isFullScreen, btnClass, btnDisabled}: CameraActionType) => {
  return (
    <div className={style.captureActions}>
      <button
        className={classNames(style.btn, btnClass)}
        onClick={handleClick} disabled={btnDisabled}>
        <div className={classNames({[style.btnText]: isFullScreen})}>{btnText}</div>
      </button>
    </div>
  )
}

type CameraErrorType = {
  onUploadFallback: File => void,
  fileInput?: React.Ref<'input'>,
  trackScreen: Function,
  i18n: Object,
}

class CameraError extends React.Component<CameraErrorType> {
  fileInput = null

  componentDidMount () {
    if (this.props.cameraError.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  handleUpload = (event) => {
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

  errorInstructions = (type, text) =>
    <span onClick={this.onFallbackClick} className={style.errorLink}>
      { text }
      <input type="file" accept={type === 'uploadFallback' ? 'image/*' : 'image/*;capture=camera'}
        ref={(ref) => this.fileInput = ref} style={'display: none'}
        onChange={this.handleFallback}
      />
    </span>

  render = () =>
    <div className={style.errorContainer}>
      <Error
        i18n={this.props.i18n}
        className={style.errorMessage}
        error={this.props.cameraError}
        renderInstruction={ str =>
          parseTags(str, ({type,text}) => this.errorInstructions(type,text))}
        smaller
      />
    </div>
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.

export class CameraPure extends React.Component<CameraPureType> {
  static defaultProps = {
    useFullScreen: () => {},
  }

  componentDidMount() {
    if (this.props.method === 'face') {
      this.props.useFullScreen(true)
    }
  }

  componentWillUnmount() {
    this.props.useFullScreen(false)
  }

  render() {
    const {method, title, subTitle, onUserMedia, onUploadFallback, hasError, cameraError,
      onFailure, webcamRef, isFullScreen, i18n, video, trackScreen} = this.props;
    return (
      <div className={style.camera}>
        <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
        <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
          {
            hasError ?
              <CameraError {...{cameraError, onUploadFallback, i18n, trackScreen}}/> :
              null
          }
          <Webcam
            className={style.video}
            audio={!!video}
            height={720}
            {...{onUserMedia, ref: webcamRef, onFailure}}
          />
          <Overlay {...{method, isFullScreen}}/>
        </div>
      </div>
    )
  }
}

const permissionErrors = ['PermissionDeniedError', 'NotAllowedError', 'NotFoundError']

export default class Camera extends React.Component<CameraType, CameraStateType> {
  webcam: ?React$ElementRef<typeof Webcam> = null
  selfieTimeoutId = null

  static defaultProps = {
    onFailure: () => {},
  }

  state: CameraStateType = {
    hasError: false,
    hasGrantedPermission: undefined,
    hasSeenPermissionsPrimer: false,
    cameraError: {}
  }

  componentDidMount () {
    this.props.trackScreen('camera')
    checkIfWebcamPermissionGranted(hasGrantedPermission =>
      this.setState({ hasGrantedPermission: hasGrantedPermission || undefined }))
    this.clearSelfieTimeout()
    this.selfieTimeoutId = setTimeout(() => {
      this.setState({hasError: true, cameraError: { name: 'CAMERA_INACTIVE', type: 'warning' }})
    }, 8000)
  }

  componentWillUnmount() {
    this.clearSelfieTimeout()
  }

  setPermissionsPrimerSeen = () => {
    this.setState({ hasSeenPermissionsPrimer: true })
  }

  clearSelfieTimeout = () =>
    this.selfieTimeoutId && clearTimeout(this.selfieTimeoutId)

  renderCamera = () => {
    const props = {
      ...this.props,
      onUserMedia: this.handleUserMedia,
      onFailure: this.handleWebcamFailure,
      hasError: this.state.hasError,
      cameraError: this.state.cameraError
    };
    if (this.props.autoCapture) return <AutoCapture {...props} />
    return process.env.LIVENESS_ENABLED && this.props.liveness ?
      <Video {...props} /> :
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
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state;
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
