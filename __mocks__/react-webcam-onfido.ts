import { h, Component } from 'preact'
import type { WebcamProps } from 'react-webcam-onfido'

export default class Webcam extends Component<WebcamProps> {
  componentDidMount(): void {
    this.props.onUserMedia && this.props.onUserMedia()
  }

  getCanvas = (): HTMLCanvasElement => document.createElement('canvas')
  getVideoBlob = (): Blob => new Blob()
  startRecording = (): void => null
  stopRecording = (): void => null

  render(): h.JSX.Element {
    return null
  }
}
