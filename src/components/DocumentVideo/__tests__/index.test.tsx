import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import DocumentOverlay, {
  Props as DocumentOverlayProps,
} from '../../Overlay/DocumentOverlay'
import DocumentLiveCapture, {
  Props as DocumentLiveCaptureProps,
} from '../../Photo/DocumentLiveCapture'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'
import Timeout, { Props as TimeoutProps } from '../../Timeout'

import DocumentVideo, { DocumentVideoProps } from '../index'
import Recording, { RecordingProps } from '../Recording'
import StartRecording, { StartRecordingProps } from '../StartRecording'

import type { CapturePayload } from '~types/redux'

jest.mock('../../CameraPermissions/withPermissionsFlow')

const fakePayload: CapturePayload = {
  blob: new Blob(),
  sdkMetadata: {},
}

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

describe('DocumentVideo', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedReduxProvider>
        <MockedLocalised>
          <DocumentVideo {...defaultProps} />
        </MockedLocalised>
      </MockedReduxProvider>
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    let wrapper: ReactWrapper

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
        const documentLiveCapture = wrapper.find<DocumentLiveCaptureProps>(
          DocumentLiveCapture
        )
        documentLiveCapture.props().onCapture(fakePayload)
        wrapper.update()
      })

      it('switches to video step after front side image captured', () => {
        const videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
        expect(videoCapture.exists()).toBeTruthy()

        const {
          cameraClassName,
          inactiveError,
          onRedo,
          renderFallback,
          trackScreen,
        } = videoCapture.props()

        expect(cameraClassName).toEqual('fakeCameraClass')
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

      it('starts recording correctly', () => {
        const startRecordingButton = wrapper.find(
          'StartRecording Button > button'
        )
        startRecordingButton.simulate('click')
        wrapper.update()

        expect(wrapper.find('VideoCapture StartRecording').exists()).toBeFalsy()
        const recording = wrapper.find<RecordingProps>(Recording)
        expect(recording.exists()).toBeTruthy()
        expect(recording.props().disableInteraction).toBeFalsy()
        expect(recording.props().hasMoreSteps).toBeTruthy()
      })

      it('handles redo fallback correctly', () => {
        const startRecordingButton = wrapper.find(
          'StartRecording Button > button'
        )
        startRecordingButton.simulate('click')
        const timeout = wrapper.find<TimeoutProps>(Timeout)
        timeout.props().onTimeout()
        wrapper.update()

        expect(wrapper.find('VideoCapture Recording').exists()).toBeFalsy()
        const startRecording = wrapper.find<StartRecordingProps>(StartRecording)
        expect(startRecording).toBeTruthy()

        // @FIXME: this requires mocking parseTags util in CameraError/index.tsx:69
        // expect(startRecording.props().disableInteraction).toBeFalsy()
      })
    })
  })
})
