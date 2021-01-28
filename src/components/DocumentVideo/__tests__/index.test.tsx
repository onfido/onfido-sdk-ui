import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import DocumentOverlay, {
  Props as DocumentOverlayProps,
} from '../../Overlay/DocumentOverlay'
import DocumentLiveCapture, {
  Props as DocumentLiveCaptureProps,
} from '../../Photo/DocumentLiveCapture'
import FallbackButton, {
  Props as FallbackButtonProps,
} from '../../Button/FallbackButton'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'
import Timeout, { Props as TimeoutProps } from '../../Timeout'

import DocumentVideo, { Props as DocumentVideoProps } from '../index'
import Recording, { Props as RecordingProps } from '../Recording'
import StartRecording, { Props as StartRecordingProps } from '../StartRecording'

import type { SdkMetadata } from '~types/commons'

jest.mock('../../utils', () => ({
  checkIfWebcamPermissionGranted: jest
    .fn()
    .mockImplementation((callback) => callback(true)),
  parseTags: jest.fn().mockImplementation((text, handler) => handler({ text })),
}))

const fakeSdkMetadata: SdkMetadata = {
  captureMethod: 'live',
  camera_name: 'fake-video-track',
  microphone_name: 'fake-audio-track',
}

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

describe('DocumentVideo', () => {
  let wrapper: ReactWrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    wrapper = mount(
      <MockedReduxProvider>
        <MockedLocalised>
          <DocumentVideo {...defaultProps} />
        </MockedLocalised>
      </MockedReduxProvider>
    )
  })

  it('renders the front document capture by default', () => {
    const documentLiveCapture = wrapper.find<DocumentLiveCaptureProps>(
      DocumentLiveCapture
    )
    expect(documentLiveCapture.exists()).toBeTruthy()

    const {
      documentType,
      isUploadFallbackDisabled,
      renderFallback,
      trackScreen,
    } = documentLiveCapture.props()

    expect(documentType).toEqual(defaultProps.documentType)
    expect(isUploadFallbackDisabled).toBeTruthy()
    renderFallback('fake_fallback_reason')
    expect(defaultProps.renderFallback).toHaveBeenCalledWith(
      'fake_fallback_reason'
    )
    trackScreen('fake_screen_tracking')
    expect(defaultProps.trackScreen).toHaveBeenCalledWith(
      'fake_screen_tracking'
    )
  })

  describe('when capture video', () => {
    beforeEach(() => {
      wrapper
        .find('DocumentLiveCapture CameraButton > button')
        .simulate('click')
      wrapper.update()
    })

    it('switches to video step after front side image captured', () => {
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
      expect(defaultProps.trackScreen).toHaveBeenCalledWith(
        'fake_screen_tracking'
      )

      expect(videoCapture.find('StartRecording').exists()).toBeTruthy()
    })

    it('renders correct overlay', () => {
      const documentOverlay = wrapper.find<DocumentOverlayProps>(
        DocumentOverlay
      )
      expect(documentOverlay.exists()).toBeTruthy()
      expect(documentOverlay.props().type).toEqual(defaultProps.documentType)
    })

    describe('when inactive timed out', () => {
      beforeEach(() => {
        const timeout = wrapper.find<TimeoutProps>(Timeout)
        timeout.props().onTimeout()
        wrapper.update()
      })

      it('handles redo fallback correctly', () => {
        const error = wrapper.find('CameraError Error')
        expect(error.exists()).toBeTruthy()
        expect(error.find('.title').text()).toEqual(
          'selfie_capture.alert.camera_inactive.title'
        )
      })
    })

    describe('when recording', () => {
      beforeEach(() => {
        const button = wrapper.find('StartRecording Button > button')
        button.simulate('click')
      })

      describe('when inactive timed out', () => {
        beforeEach(() => {
          const timeout = wrapper.find<TimeoutProps>(Timeout)
          timeout.props().onTimeout()
          wrapper.update()
        })

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

      it('starts recording correctly', () => {
        expect(wrapper.find('VideoCapture StartRecording').exists()).toBeFalsy()
        const recording = wrapper.find<RecordingProps>(Recording)
        expect(recording.exists()).toBeTruthy()
        expect(recording.props().disableInteraction).toBeFalsy()
        expect(recording.props().hasMoreSteps).toBeTruthy()
        expect(recording.find('Instructions').exists()).toBeTruthy()
        expect(recording.find('Instructions').props()).toMatchObject({
          icon: 'tilt',
          title: 'doc_video_capture.instructions.video_tilt_title',
          subtitle: 'doc_video_capture.instructions.video_tilt_subtitle',
        })
      })

      it('moves to the next step correctly', () => {
        const button = wrapper.find('Recording Button > button')
        button.simulate('click')

        const recording = wrapper.find<RecordingProps>(Recording)
        expect(recording.props().disableInteraction).toBeFalsy()
        expect(recording.props().hasMoreSteps).toBeFalsy()
        expect(recording.find('Instructions').exists()).toBeTruthy()
        expect(recording.find('Instructions').props()).toMatchObject({
          icon: 'flip',
          title: 'doc_video_capture.instructions.video_flip_title',
          subtitle: 'doc_video_capture.instructions.video_flip_subtitle',
        })
      })

      it('switches to the back document capture step', () => {
        const recordingButton = wrapper.find('Recording Button > button')
        recordingButton.simulate('click') // next step
        recordingButton.simulate('click') // stop recording
        wrapper.update()

        expect(wrapper.find('VideoCapture').exists()).toBeFalsy()
        expect(wrapper.find('DocumentLiveCapture').exists()).toBeTruthy()
        const cameraButton = wrapper.find(
          'DocumentLiveCapture CameraButton > button'
        )
        cameraButton.simulate('click')

        expect(defaultProps.onCapture).toHaveBeenCalledWith({
          front: {
            blob: new Blob([]),
            sdkMetadata: fakeSdkMetadata,
            filename: 'document_front.jpeg',
            isPreviewCropped: true,
          },
          video: {
            blob: new Blob([]),
            sdkMetadata: fakeSdkMetadata,
            filename: 'document_video.webm',
          },
          back: {
            blob: new Blob([]),
            sdkMetadata: fakeSdkMetadata,
            filename: 'document_back.jpeg',
            isPreviewCropped: true,
          },
        })
      })
    })
  })
})
