import { h, Component } from 'preact'
import type { WebcamProps } from 'react-webcam-onfido'

export default class Webcam extends Component<WebcamProps> {
  componentDidMount(): void {
    this.props.onUserMedia && this.props.onUserMedia()
  }

  stream: MediaStream = {
    active: true,
    id: 'fake-media-id',
    addEventListener: jest.fn(),
    addTrack: jest.fn(),
    clone: jest.fn(),
    dispatchEvent: jest.fn(),
    getAudioTracks: jest.fn().mockReturnValue([{ label: 'fake-audio-track' }]),
    getTrackById: jest.fn(),
    getTracks: jest.fn(),
    getVideoTracks: jest.fn().mockReturnValue([{ label: 'fake-video-track' }]),
    onaddtrack: jest.fn(),
    onremovetrack: jest.fn(),
    removeEventListener: jest.fn(),
    removeTrack: jest.fn(),
  }

  getCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.toBlob = jest
      .fn()
      .mockImplementation((callback) =>
        callback(new Blob([], { type: 'image/jpeg' }))
      )
    return canvas
  }
  getVideoBlob = (): Blob => new Blob([], { type: 'video/webm' })
  startRecording = (): void => null
  stopRecording = (): void => null

  render(): h.JSX.Element {
    return null
  }
}
