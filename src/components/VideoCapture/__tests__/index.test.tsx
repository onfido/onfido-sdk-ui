import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import Camera from '../../Camera'
import VideoCapture, { Props as VideoCaptureProps } from '../index'

import type { CameraProps } from '~types/camera'

jest.mock('../../utils', () => ({
  checkIfWebcamPermissionGranted: jest
    .fn()
    .mockImplementation((callback) => callback(true)),
}))

const defaultProps: VideoCaptureProps = {
  inactiveError: { name: 'VIDEO_TIMEOUT' },
  onRecordingStart: jest.fn(),
  onRedo: jest.fn(),
  onVideoCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
  /* eslint-disable-next-line react/display-name */
  renderVideoLayer: ({ disableInteraction, isRecording, onStart, onStop }) => (
    <button
      id="record-video"
      disabled={disableInteraction}
      onClick={isRecording ? onStop : onStart}
    >
      {isRecording ? 'Stop' : 'Start'}
    </button>
  ),
}

describe('VideoCapture', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedReduxProvider>
        <MockedLocalised>
          <VideoCapture {...defaultProps} />
        </MockedLocalised>
      </MockedReduxProvider>
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    let wrapper: ReactWrapper
    let camera: ReactWrapper<CameraProps>

    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <VideoCapture {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      camera = wrapper.find<CameraProps>(Camera)
    })

    it('renders Camera correctly', () => {
      expect(wrapper.exists()).toBeTruthy()
      expect(camera.exists()).toBeTruthy()

      const {
        buttonType,
        isButtonDisabled,
        renderError,
        renderFallback,
      } = camera.props()
      expect(buttonType).toEqual('video')
      expect(isButtonDisabled).toBeFalsy()
      expect(renderError).toBeFalsy()

      renderFallback('fake_fallback_reason')
      expect(defaultProps.renderFallback).toHaveBeenCalledWith(
        'fake_fallback_reason'
      )
    })

    it('renders inactive timeout correctly', () => {
      const timeout = wrapper.find('Timeout')
      expect(timeout.exists()).toBeTruthy()
      expect(timeout.prop('seconds')).toEqual(12)
    })

    describe('when recording', () => {
      let recordButton: ReactWrapper

      beforeEach(() => {
        recordButton = wrapper.find('#record-video')
        recordButton.simulate('click')
      })

      it('starts video recording', () => {
        expect(defaultProps.onRecordingStart).toHaveBeenCalled()
      })

      it('renders inactive timeout correctly', () => {
        const timeout = wrapper.find('Timeout')
        expect(timeout.exists()).toBeTruthy()
        expect(timeout.prop('seconds')).toEqual(20)
      })

      it('stops video recording with capture payload', () => {
        recordButton.simulate('click')

        expect(defaultProps.onVideoCapture).toHaveBeenCalledWith({
          blob: new Blob(),
          sdkMetadata: {
            camera_name: 'fake-video-track',
            captureMethod: 'live',
            microphone_name: 'fake-audio-track',
          },
        })
      })
    })
  })
})
