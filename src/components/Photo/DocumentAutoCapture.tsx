import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import Webcam from '~webcam/react-webcam'
import { screenshot } from '~utils/camera'
import { blobToLossyBase64 } from '~utils/blob'
import { randomId } from '~utils/string'
import { DocumentOverlay } from '../Overlay'
import Camera from '../Camera'
import CameraError from '../CameraError'
import { postToBackend } from '~utils/sdkBackend'

import type { ErrorCallback } from '~types/api'
import type { SdkMetadata, UrlsConfig } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import type {
  ErrorProp,
  HandleCaptureProp,
  RenderFallbackProp,
} from '~types/routers'

const maxAttempts = 3

const requestError: ErrorProp = { name: 'REQUEST_ERROR', type: 'error' }

type Props = {
  onError: () => void
  onValidCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
  renderTitle?: h.JSX.Element | null
  token?: string
  triggerOnError: ErrorCallback
  urls: UrlsConfig
} & WithTrackingProps

type State = {
  error?: ErrorProp
}

const initialState: State = {
  error: undefined,
}

export default class DocumentAutoCapture extends Component<Props, State> {
  private webcam?: Webcam
  private interval?: number
  private captureIds: string[] = []

  state = { ...initialState }

  componentDidMount(): void {
    this.start()
  }

  componentWillUnmount(): void {
    this.stop()
  }

  screenshot = (): void => {
    if (!this.webcam) {
      return
    }

    if (this.captureIds.length < maxAttempts) {
      screenshot(this.webcam, (blob: Blob, sdkMetadata: SdkMetadata) =>
        this.handleScreenshotBlob(blob, sdkMetadata)
      )
    } else {
      console.warn(
        'Screenshotting is slow, waiting for responses before uploading more'
      )
    }
  }

  start = (): void => {
    this.stop()
    this.interval = Visibility.every(1000, this.screenshot)
  }

  stop = (): void => {
    this.interval && Visibility.stop(this.interval)
  }

  handleScreenshotBlob = (blob: Blob, sdkMetadata: SdkMetadata): void =>
    blobToLossyBase64(
      blob,
      (base64) => this.handleScreenshot(blob, base64, sdkMetadata),
      (error) => console.error('Error converting screenshot to base64', error),
      { maxWidth: 200 }
    )

  handleScreenshot = (
    blob: Blob,
    base64: string,
    sdkMetadata: SdkMetadata
  ): void => {
    if (base64) {
      const id = randomId()
      this.captureIds.push(id)

      this.validate(base64, id, (valid) =>
        valid
          ? this.props.onValidCapture({ blob, base64, id, sdkMetadata })
          : null
      )
    }
  }

  validate = (
    base64: string,
    id: string,
    callback: (valid: boolean) => void
  ): void => {
    const { urls, token } = this.props
    const url = urls.detect_document_url
    const data = JSON.stringify({ image: base64, id })

    postToBackend(
      data,
      url,
      token,
      ({ valid }) => {
        this.setProcessed(id)
        callback(valid)
      },
      this.handleValidationError
    )
  }

  setProcessed = (id: string): void => {
    this.captureIds = this.captureIds.filter((captureId) => captureId === id)
  }

  handleValidationError: ErrorCallback = (error) => {
    this.setState({
      error: {
        ...requestError,
        properties: {
          error_message: error?.response?.message,
        },
      },
    })
    this.props.triggerOnError(error)
    this.props.onError()
  }

  render(): h.JSX.Element {
    const { trackScreen, renderFallback } = this.props
    const { error } = this.state

    return (
      <Camera
        {...this.props}
        buttonType="none"
        docAutoCaptureFrame
        webcamRef={(ref) => ref && (this.webcam = ref)}
        renderError={
          error ? (
            <CameraError error={error} {...{ trackScreen, renderFallback }} />
          ) : null
        }
      >
        <DocumentOverlay />
      </Camera>
    )
  }
}
