// @flow
import * as React from 'react'
import { h } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import CustomFileInput from '../CustomFileInput'
import { isDesktop, parseTags } from '../utils'
import style from './style.css'

type Props = {
  changeFlowTo: FlowNameType => void,
  onUploadFallback: File => void,
  trackScreen: Function,
  i18n: Object,
  method: string,
  error: Object,
  fallback?: string => React.Node,
  hasBackdrop?: boolean,
}

export default class CameraError extends React.Component<Props> {

  componentDidMount () {
    if (this.props.error.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  handleFileInputClick = () => {
    if (this.props.error.type === 'warning') {
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
      error, hasBackdrop, i18n,
      fallback = this.defaultFallback,
    } = this.props
    return (
      <div className={classNames(style.errorContainer, style[`${error.type}ContainerType`], {
        [style.errorHasBackdrop]: hasBackdrop,
      })}>
        <Error
          className={style.errorMessage}
          i18n={i18n}
          error={error}
          renderInstruction={ str => parseTags(str,
            ({text}) => <span className={style.fallbackLink}>{fallback(text)}</span>)
          }
        />
      </div>
    )
  }
}