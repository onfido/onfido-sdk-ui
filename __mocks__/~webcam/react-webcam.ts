import { Component, h } from 'preact'
import { WebcamProps } from '~webcam/react-webcam'

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
    getVideoTracks: jest.fn().mockReturnValue([
      {
        label: 'fake-video-track',
        getSettings(): MediaTrackSettings {
          return {}
        },
      },
    ]),
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
  startRecording = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
  stopRecording = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function

  render(): h.JSX.Element | null {
    return null
  }
}
