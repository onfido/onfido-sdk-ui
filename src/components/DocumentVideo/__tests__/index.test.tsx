import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { fakeCapturePayload } from '~jest/captures'
import DocumentOverlay, {
  Props as DocumentOverlayProps,
} from '../../Overlay/DocumentOverlay'
import FallbackButton, {
  Props as FallbackButtonProps,
} from '../../Button/FallbackButton'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'
import Timeout, { Props as TimeoutProps } from '../../Timeout'

import DocumentVideo, { Props as DocumentVideoProps } from '../index'
import Recording, { Props as RecordingProps } from '../Recording'
import StartRecording, { Props as StartRecordingProps } from '../StartRecording'

jest.mock('../../utils')

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

const simulateTimeout = (wrapper: ReactWrapper) => {
  const timeout = wrapper.find<TimeoutProps>(Timeout)
  timeout.props().onTimeout()
  wrapper.update()
}

const simulateCaptureStart = (wrapper: ReactWrapper) => {
  const button = wrapper.find('StartRecording Button > button')
  button.simulate('click')
}

const simulateCaptureNext = (wrapper: ReactWrapper) => {
  const button = wrapper.find('Recording Button > button')
  button.simulate('click')
}

const assertOverlay = (wrapper: ReactWrapper, withPlaceholder: boolean) => {
  const documentOverlay = wrapper.find<DocumentOverlayProps>(DocumentOverlay)
  expect(documentOverlay.exists()).toBeTruthy()
  expect(documentOverlay.props().type).toEqual(defaultProps.documentType)
  expect(documentOverlay.props().withPlaceholder).toEqual(withPlaceholder)
}

const assertIntroStep = (wrapper: ReactWrapper, forPassport: boolean) => {
  const videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
  expect(videoCapture.exists()).toBeTruthy()

  const {
    cameraClassName,
    facing,
    inactiveError,
    onRedo,
    renderFallback,
    trackScreen,
  } = videoCapture.props()

  expect(cameraClassName).toEqual('fakeCameraClass')
  expect(facing).toEqual('environment')
  expect(inactiveError.name).toEqual('CAMERA_INACTIVE_NO_FALLBACK')

  expect(onRedo).toBeDefined()

  renderFallback('fake_fallback_reason')
  expect(defaultProps.renderFallback).toHaveBeenCalledWith(
    'fake_fallback_reason'
  )
  trackScreen('fake_screen_tracking')
  expect(defaultProps.trackScreen).toHaveBeenCalledWith('fake_screen_tracking')

  expect(videoCapture.find('StartRecording').exists()).toBeTruthy()

  if (forPassport) {
    expect(videoCapture.find('Instructions').props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.intro_title',
    })
  } else {
    expect(videoCapture.find('Instructions').props()).toMatchObject({
      title: 'doc_video_capture.instructions.others.intro_title',
    })
  }
}

const assertTiltStep = (
  wrapper: ReactWrapper,
  forPassport: boolean,
  hasMoreSteps: boolean
) => {
  expect(wrapper.find('VideoCapture StartRecording').exists()).toBeFalsy()
  const recording = wrapper.find<RecordingProps>(Recording)
  expect(recording.exists()).toBeTruthy()
  expect(recording.props().disableInteraction).toBeFalsy()
  expect(recording.props().hasMoreSteps).toEqual(hasMoreSteps)
  expect(recording.find('Instructions').exists()).toBeTruthy()

  if (forPassport) {
    expect(recording.find('Instructions').props()).toMatchObject({
      icon: 'tilt',
      title: 'doc_video_capture.instructions.passport.tilt_title',
      subtitle: 'doc_video_capture.instructions.passport.tilt_subtitle',
    })
  } else {
    expect(recording.find('Instructions').props()).toMatchObject({
      icon: 'tilt',
      title: 'doc_video_capture.instructions.others.tilt_title',
      subtitle: 'doc_video_capture.instructions.others.tilt_subtitle',
    })
  }
}

const assertBackStep = (wrapper: ReactWrapper, forPassport: boolean) => {
  const recording = wrapper.find<RecordingProps>(Recording)
  expect(recording.props().disableInteraction).toBeFalsy()
  expect(recording.props().hasMoreSteps).toBeFalsy()
  expect(recording.find('Instructions').exists()).toBeTruthy()

  if (forPassport) {
    expect(recording.find('Instructions').props()).toMatchObject({
      icon: 'back',
      title: 'doc_video_capture.instructions.passport.back_title',
      subtitle: 'doc_video_capture.instructions.passport.back_subtitle',
    })
  } else {
    expect(recording.find('Instructions').props()).toMatchObject({
      icon: 'back',
      title: 'doc_video_capture.instructions.others.back_title',
      subtitle: 'doc_video_capture.instructions.others.back_subtitle',
    })
  }
}

describe('DocumentVideo', () => {
  let wrapper: ReactWrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('with double-sided documents', () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <DocumentVideo {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertIntroStep(wrapper, false))

    it('renders overlay correctly', () => assertOverlay(wrapper, true))

    it('sets correct timeout', () => {
      const timeout = wrapper.find<TimeoutProps>(Timeout)
      expect(timeout.props().seconds).toEqual(12)
    })

    describe('when inactive timed out', () => {
      beforeEach(() => simulateTimeout(wrapper))

      it('handles redo fallback correctly', () => {
        const error = wrapper.find('CameraError Error')
        expect(error.exists()).toBeTruthy()
        expect(error.find('.title').text()).toEqual(
          'selfie_capture.alert.camera_inactive.title'
        )
      })
    })

    describe('when recording', () => {
      beforeEach(() => simulateCaptureStart(wrapper))

      describe('when inactive timed out', () => {
        beforeEach(() => simulateTimeout(wrapper))

        it('handles redo fallback correctly', () => {
          const error = wrapper.find('CameraError Error')
          expect(error.exists()).toBeTruthy()
          expect(error.find('.title').text()).toEqual(
            'selfie_capture.alert.timeout.title'
          )
          expect(error.find('.instruction button').text()).toEqual(
            'selfie_capture.alert.timeout.detail'
          )

          wrapper.find<FallbackButtonProps>(FallbackButton).props().onClick()
          wrapper.update()

          expect(wrapper.find('VideoCapture Recording').exists()).toBeFalsy()
          const startRecording = wrapper.find<StartRecordingProps>(
            StartRecording
          )
          expect(startRecording.exists()).toBeTruthy()
          expect(startRecording.props().disableInteraction).toBeFalsy()
        })
      })

      it('sets correct timeout', () => {
        const timeout = wrapper.find<TimeoutProps>(Timeout)
        expect(timeout.props().seconds).toEqual(30)
      })

      it('starts recording correctly', () => {
        assertOverlay(wrapper, false)
        assertTiltStep(wrapper, false, true)
      })

      it('moves to the next step correctly', () => {
        simulateCaptureNext(wrapper)
        assertBackStep(wrapper, false)
      })

      it('switches to the back document capture step', () => {
        simulateCaptureNext(wrapper)
        simulateCaptureNext(wrapper)

        expect(defaultProps.onCapture).toHaveBeenCalledWith({
          front: {
            ...fakeCapturePayload('standard'),
            filename: 'document_front.jpeg',
          },
          video: {
            ...fakeCapturePayload('video'),
            filename: 'document_video.webm',
          },
          back: {
            ...fakeCapturePayload('standard'),
            filename: 'document_back.jpeg',
          },
        })
      })
    })
  })

  describe('with single-sided documents', () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <DocumentVideo {...defaultProps} documentType="passport" />
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertIntroStep(wrapper, true))

    describe('when recording', () => {
      beforeEach(() => simulateCaptureStart(wrapper))

      it('starts recording correctly', () =>
        assertTiltStep(wrapper, true, false))

      it('ends the flow without capturing back side', () => {
        simulateCaptureNext(wrapper)

        expect(defaultProps.onCapture).toHaveBeenCalledWith({
          front: {
            ...fakeCapturePayload('standard'),
            filename: 'document_front.jpeg',
          },
          video: {
            ...fakeCapturePayload('video'),
            filename: 'document_video.webm',
          },
        })
      })
    })
  })
})
