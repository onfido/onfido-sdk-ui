// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Error from '../Error'
import CustomFileInput from '../CustomFileInput'
import { isDesktop } from '../utils'
import style from './style.css'

type CameraErrorType = {
  changeFlowTo: FlowNameType => void,
  onUploadFallback: File => void,
  trackScreen: Function,
  i18n: Object,
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
      onChange={this.props.onUploadFallback}
      onClick={this.handleFileInputClick}
      accept="image/*"
      capture={ this.props.method === 'face' ? 'user' : true }
    >
      { text }
    </CustomFileInput>

  crossDeviceFallback = (text: string) =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps')}>
      {text}
    </span>

  defaultFallback = isDesktop ? this.crossDeviceFallback : this.basicCameraFallback

  render = () => {
    const {
      cameraError, cameraErrorHasBackdrop, i18n,
      cameraErrorFallback = this.defaultFallback,
    } = this.props
    return (
      <div className={classNames(style.errorContainer, style[`${cameraError.type}ContainerType`], {
        [style.errorHasBackdrop]: cameraErrorHasBackdrop,
      })}>
        <Error
          className={style.errorMessage}
          i18n={i18n}
          error={cameraError}
          renderInstruction={ str =>
            <span className={style.fallbackLink}>
            { parseTags(str, ({text}) => cameraErrorFallback(text)) }
            </span>
          }
        />
      </div>
    )
  }
}