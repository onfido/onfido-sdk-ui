// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import Dropzone from 'react-dropzone'

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

const UploadFallback = ({onUploadFallback, onFallbackClick, method, i18n}) => {
  const text = i18n && method ? i18n.t(`capture.${method}.help`) : ''
  return (
    <Dropzone
      onDrop={([file]) => onUploadFallback(file)}
      className={style.uploadFallback}
      multiple={false}>
      <button onClick={onFallbackClick}>{text}</button>
    </Dropzone>
  )
}

export const CaptureActions = ({handleClick, btnText, isFullScreen, btnClass}: CameraActionType) => {
  return (
    <div className={style.captureActions}>
      <button
        className={classNames(style.btn, btnClass)}
        onClick={handleClick}>
        <div className={classNames({[style.btnText]: isFullScreen})}>{btnText}</div>
      </button>
    </div>
  )
}

const reload = () => window.location.reload()

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
    const {method, title, subTitle, onUploadFallback, onFallbackClick, hasError,
      onUserMedia, onFailure, webcamRef, isFullScreen, i18n, video} = this.props;
    return (
      <div className={style.camera}>
        <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
        <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
          {
            hasError ?
              <div className={style.errorContainer}>
                <Error
                  {...{i18n}}
                  className={style.errorMessage}
                  error={{ name: 'CAMERA_NOT_WORKING', type: 'error' }}
                  renderInstruction={ str =>
                    parseTags(str, ({ text }) => <span onClick={reload} className={style.errorLink}>{text}</span>)
                  }
                  smaller
                />
              </div> :
              null
          }
          <Webcam
            className={style.video}
            audio={!!video}
            height={720}
            {...{onUserMedia, ref: webcamRef, onFailure}}
          />
          <Overlay {...{method, isFullScreen}}/>
          { !video && <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/> }
        </div>
      </div>
    )
  }
}

const permissionErrors = ['PermissionDeniedError', 'NotAllowedError', 'NotFoundError']

export default class Camera extends React.Component<CameraType, CameraStateType> {
  webcam: ?React$ElementRef<typeof Webcam> = null

  static defaultProps = {
    onFailure: () => {},
  }

  state: CameraStateType = {
    hasError: false,
    hasGrantedPermission: undefined,
    hasSeenPermissionsPrimer: false,
  }

  componentDidMount () {
    this.props.trackScreen('camera')
    checkIfWebcamPermissionGranted(hasGrantedPermission =>
      this.setState({ hasGrantedPermission: hasGrantedPermission || undefined }))
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
      this.setState({ hasError: true })
    }
    this.props.onFailure()
  }

  handleRecoverPermissionsRefresh = reload

  render = () => {
    const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state;
    return (
      hasGrantedPermission === false ?
        <PermissionsRecover
          {...this.props}
          onRefresh={this.handleRecoverPermissionsRefresh}
        /> :
        (hasGrantedPermission || hasSeenPermissionsPrimer) ?
          this.renderCamera() :
          <PermissionsPrimer
            {...this.props}
            onNext={this.setPermissionsPrimerSeen}
          />
    )
  }
}

