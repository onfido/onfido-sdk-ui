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

import CustomFileInput from '../CustomFileInput'
import { isDesktop } from '../utils'

import classNames from 'classnames'
import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType, CameraStateType, FlowNameType } from './CameraTypes'
import { parseTags } from '../utils'
import { DynamicCrossDeviceFlow } from '../crossDevice'


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
  i18n: Object,
  method: string,
  cameraError: Object,
  cameraErrorFallback?: string => React.Node,
  cameraErrorHasBackdrop?: boolean,
  cameraErrorIsDismissible?: boolean,
}

type CameraErrorStateType = {
  isDimissed: boolean,
}

class CameraError extends React.Component<CameraErrorType, CameraErrorStateType> {
  state = {
    isDimissed: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cameraError.name !== this.props.cameraError.name) {
      this.setState({ isDimissed: false })
    }
  }

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
    <DynamicCrossDeviceFlow
      i18n={ this.props.i18n }
      trackScreen={ this.props.trackScreen }
      renderButton={ enter =>
        <span onClick={ enter } className={style.fallbackLink}>{text}</span> }
    />

  defaultFallback = isDesktop ? this.crossDeviceFallback : this.basicCameraFallback

  handleDismiss = () => this.setState({ isDimissed: true })

  render = () => {
    const {
      cameraError, cameraErrorHasBackdrop, i18n,
      cameraErrorFallback = this.defaultFallback,
      cameraErrorIsDismissible,
    } = this.props
    return (
      !this.state.isDimissed &&
        <div className={classNames(style.errorContainer, style[`${cameraError.type}ContainerType`], {
          [style.errorHasBackdrop]: cameraErrorHasBackdrop,
        })}>
          <Error
            className={style.errorMessage}
            i18n={i18n}
            error={cameraError}
            isDismissible={cameraErrorIsDismissible}
            onDismiss={this.handleDismiss}
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
                            onUserMedia, onFailure, webcamRef, isFullScreen, i18n,
                            isWithoutHole, className, video, changeFlowTo,
                            trackScreen, cameraError, cameraErrorFallback,
                            cameraErrorHasBackdrop, cameraErrorIsDismissible,
                          }: CameraPureType) => (

  <div className={classNames(style.camera, className)}>
    <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
    <div className={classNames(style.container,
      {[style.fullScreenContainer]: isFullScreen,
        [style.autoCaptureContainer]: !isFullScreen})}>
      {
        hasError ?
          <CameraError {...{
            cameraError, cameraErrorHasBackdrop, cameraErrorFallback,
            onUploadFallback, i18n, trackScreen, changeFlowTo, method,
            cameraErrorIsDismissible,
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

export default (props) => {
  if (props.autoCapture) return <AutoCapture {...props} />
  return props.liveness ?
    <Liveness {...props} /> :
    <Photo {...props} />
}
