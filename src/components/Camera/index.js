// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import Dropzone from 'react-dropzone'

import { Overlay } from '../Overlay'
import Title from '../Title'
import AutoCapture from './AutoCapture'
import Photo from './Photo'
import Video from './Video'
import PermissionsPrimer from './PermissionsPrimer'

import classNames from 'classnames'
import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType} from './CameraTypes'
import { checkIfWebcamPermissionGranted } from '../utils'

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
    const {method, title, subTitle, onUploadFallback, onFallbackClick,
      onUserMedia, webcamRef, isFullScreen, onWebcamError, i18n, liveness} = this.props;

    return (
      <div className={style.camera}>
        <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
        <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
          <Webcam
            className={style.video}
            audio={!!liveness}
            height={720}
            {...{onUserMedia, ref: webcamRef, onFailure: onWebcamError}}
          />
          <Overlay {...{method, isFullScreen}}/>
          { !liveness && <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/> }
        </div>
      </div>
    )
  }
}

type CameraStateType = {
  hasWebcamAccess: boolean,
  hasSeenPermissionsPrimer: boolean,
}

export default class Camera extends React.Component<CameraType, CameraStateType> {
  state: CameraStateType = {
    hasWebcamAccess: false,
    hasSeenPermissionsPrimer: false,
  }

  constructor (props: CameraType) {
    super(props)
  }
  componentDidMount () {
    this.props.trackScreen('camera')
    checkIfWebcamPermissionGranted(hasWebcamAccess => this.setState({ hasWebcamAccess }))
  }

  setPermissionsPrimerSeen = () => {
    this.setState({ hasSeenPermissionsPrimer: true })
  }

  renderCamera = () => {
    if (this.props.autoCapture) return <AutoCapture {...this.props} />
    return process.env.LIVENESS_ENABLED && this.props.liveness ?
      <Video {...this.props} /> :
      <Photo {...this.props} />
  }

  render = () => {
    const { hasSeenPermissionsPrimer, hasWebcamAccess } = this.state;
    return (
      (hasWebcamAccess || hasSeenPermissionsPrimer) ?
        this.renderCamera() :
        <PermissionsPrimer
          {...this.props}
          onNext={this.setPermissionsPrimerSeen}
        />
    )
  }
}
