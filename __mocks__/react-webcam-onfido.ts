import { h, Component } from 'preact'
import type { WebcamProps } from 'react-webcam-onfido'

export default class Webcam extends Component<WebcamProps> {
  componentDidMount(): void {
    this.props.onUserMedia && this.props.onUserMedia()
  }

  startRecording(): void {}
  stopRecording(): void {}

  render(): h.JSX.Element {
    return null
  }
}
