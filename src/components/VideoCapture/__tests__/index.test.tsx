import { FunctionComponent, h, Ref } from 'preact'
import { mount, ReactWrapper, shallow } from 'enzyme'
import Webcam from '~webcam/react-webcam'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import Camera from '../../Camera'
import VideoCapture, { VideoCaptureProps, VideoOverlayProps } from '../index'

import type { CameraProps } from '~types/camera'
import type { CaptureMethods } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import { fakeCapturePayload } from '~jest/captures'

jest.mock('~utils')

const EXPECTED_VIDEO_CAPTURE = {
  INACTIVE_TIMEOUT: 12,
  FACE_VIDEO_TIMEOUT: 20,
  DOC_VIDEO_TIMEOUT: 30,
}

const assertTimeout = (wrapper: ReactWrapper, seconds: number) => {
  const timeout = wrapper.find('Timeout')
  expect(timeout.exists()).toBeTruthy()
  expect(timeout.prop('seconds')).toEqual(seconds)
}

const assertInactiveError = (
  wrapper: ReactWrapper,
  method: CaptureMethods,
  forceRedo: boolean
) => {
  expect(wrapper.find('#record-video').text()).toEqual('Start')
  expect(wrapper.find('Timeout').exists()).toBeFalsy()

  const error = wrapper.find('CameraError Error')
  expect(error.exists()).toBeTruthy()

  if (!forceRedo) {
    expect(error.find('.title').text()).toEqual(
      'selfie_capture.alert.camera_inactive.title'
    )

    return
  }

  expect(wrapper.find('#record-video').prop('disabled')).toBeTruthy()

  if (method === 'document') {
    expect(wrapper.find('FallbackButton').text()).toEqual(
      'doc_video_capture.prompt.detail_timeout'
    )
  } else {
    expect(wrapper.find('FallbackButton').text()).toEqual(
      'selfie_capture.alert.timeout.detail'
    )
  }
}

const MockedCaptureControls: FunctionComponent<VideoOverlayProps> = ({
  disableInteraction,
  isRecording,
  onStart,
  onStop,
}) => (
  <button
    type="button"
    id="record-video"
    disabled={disableInteraction}
    onClick={isRecording ? onStop : onStart}
  >
    {isRecording ? 'Stop' : 'Start'}
  </button>
)

const defaultProps: VideoCaptureProps = {
  inactiveError: { name: 'CAMERA_INACTIVE' },
  method: 'face',
  onRecordingStart: jest.fn(),
  onRedo: jest.fn(),
  onVideoCapture: jest.fn(),
  renderFallback: jest.fn(),
  renderVideoOverlay: (props) => <MockedCaptureControls {...props} />, // eslint-disable-line react/display-name
  trackScreen: jest.fn(),
}

describe('VideoCapture', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const wrapper = shallow(<VideoCapture {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    let wrapper: ReactWrapper
    let camera: ReactWrapper<CameraProps & WithTrackingProps>

    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <VideoCapture {...defaultProps} title="Fake title" />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      camera = wrapper.find<CameraProps & WithTrackingProps>(Camera)
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

      renderFallback({ text: 'Fake fallback action', type: 'fallback' })
      expect(defaultProps.renderFallback).toHaveBeenCalledWith({
        text: 'Fake fallback action',
        type: 'fallback',
      })

      expect(wrapper.find('PageTitle').exists()).toBeTruthy()
      expect(wrapper.find('PageTitle').text()).toEqual('Fake title')
    })

    it('renders inactive timeout correctly', () =>
      assertTimeout(wrapper, EXPECTED_VIDEO_CAPTURE.INACTIVE_TIMEOUT))

    describe('when inactive timed out', () => {
      beforeEach(() => {
        jest.advanceTimersByTime(EXPECTED_VIDEO_CAPTURE.INACTIVE_TIMEOUT * 1000)
        wrapper.update()
      })

      it('shows inactive error correctly', () =>
        assertInactiveError(wrapper, defaultProps.method, false))
    })

    describe('when recording', () => {
      beforeEach(() => {
        wrapper.find('#record-video').simulate('click')
      })

      it('starts video recording and hides title', () => {
        expect(wrapper.find('#record-video').text()).toEqual('Stop')
        expect(defaultProps.onRecordingStart).toHaveBeenCalled()
        expect(wrapper.find('PageTitle').exists()).toBeFalsy()
      })

      it('renders inactive timeout correctly', () =>
        assertTimeout(wrapper, EXPECTED_VIDEO_CAPTURE.FACE_VIDEO_TIMEOUT))

      it('stops video recording with capture payload', () => {
        wrapper.find('#record-video').simulate('click')
        expect(wrapper.find('#record-video').text()).toEqual('Start')

        expect(defaultProps.onVideoCapture).toHaveBeenCalledWith(
          fakeCapturePayload('video')
        )
      })

      describe('when inactive timed out', () => {
        beforeEach(() => {
          jest.advanceTimersByTime(
            EXPECTED_VIDEO_CAPTURE.FACE_VIDEO_TIMEOUT * 1000
          )
          wrapper.update()
        })

        it('shows inactive error correctly', () =>
          assertInactiveError(wrapper, defaultProps.method, true))
      })
    })

    describe('for documents', () => {
      beforeEach(() => {
        wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <VideoCapture {...defaultProps} method="document" />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        wrapper.find('#record-video').simulate('click')
      })

      it('renders inactive timeout correctly', () =>
        assertTimeout(wrapper, EXPECTED_VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT))

      describe('when inactive timed out', () => {
        beforeEach(() => {
          jest.advanceTimersByTime(
            EXPECTED_VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT * 1000
          )
          wrapper.update()
        })

        it('shows inactive error correctly', () =>
          assertInactiveError(wrapper, 'document', true))
      })
    })

    describe('with webcamRef passed', () => {
      it('triggers callback function correctly', () => {
        const mockedWebcamRef = jest.fn()

        wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <VideoCapture {...defaultProps} webcamRef={mockedWebcamRef} />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(mockedWebcamRef).toHaveBeenCalled()
      })

      it('assign ref object correctly', () => {
        const mockedWebcamRef: Ref<Webcam> = { current: null }

        wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <VideoCapture {...defaultProps} webcamRef={mockedWebcamRef} />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(mockedWebcamRef.current).toBeDefined()
      })
    })
  })
})
