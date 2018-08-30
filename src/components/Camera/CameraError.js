type CameraErrorType = {
  changeFlowTo: FlowNameType => void,
  onUploadFallback: File => void,
  fileInput?: React.Ref<'input'>,
  trackScreen: Function,
  i18n: Object,
  method: string,
  cameraError: Object,
  cameraErrorFallback?: string => React.Node,
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

  basicCameraFallback = (text: string) =>
    <span onClick={this.onFallbackClick} className={style.fallbackLink}>
      { text }
      <input type="file" accept='image/*'
        capture={ this.props.method === 'face' ? 'user' : true }
        ref={(ref) => this.fileInput = ref} style={'display: none'}
        onChange={this.handleFallback}
      />
    </span>

  crossDeviceFallback = (text: string) =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps')} className={style.fallbackLink}>
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
          renderInstruction={ str => parseTags(str, ({text}) => cameraErrorFallback(text)) }
        />
      </div>
    )
  }
}