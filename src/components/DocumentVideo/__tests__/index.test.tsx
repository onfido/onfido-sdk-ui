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
import DocumentVideo, { DocumentVideoProps } from '../index'
import VideoCapture, { VideoCaptureProps } from '../../VideoCapture'

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
        isUploadFallbackDisabled,
        renderFallback,
        trackScreen,
      } = documentLiveCapture.props()

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
      let videoCapture: ReactWrapper<VideoCaptureProps>

      beforeEach(() => {
        const documentLiveCapture = wrapper.find<DocumentLiveCaptureProps>(
          DocumentLiveCapture
        )
        documentLiveCapture.props().onCapture(fakePayload)
        wrapper.update()
        videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
      })

      it('switches to video step after front side image captured', () => {
        expect(videoCapture.exists()).toBeTruthy()

        const {
          cameraClassName,
          inactiveError,
          renderFallback,
          trackScreen,
        } = videoCapture.props()

        expect(cameraClassName).toEqual('fakeCameraClass')
        expect(inactiveError.name).toEqual('CAMERA_INACTIVE_NO_FALLBACK')

        renderFallback('fake_fallback_reason')
        expect(defaultProps.renderFallback).toHaveBeenCalledWith(
          'fake_fallback_reason'
        )
        trackScreen('fake_screen_tracking')
        expect(defaultProps.trackScreen).toHaveBeenCalledWith(
          'fake_screen_tracking'
        )
      })

      it('renders correct overlay', () => {
        const documentOverlay = videoCapture.find<DocumentOverlayProps>(
          DocumentOverlay
        )
        expect(documentOverlay.exists()).toBeTruthy()
        expect(documentOverlay.props().type).toEqual(defaultProps.documentType)
      })
    })
  })
})
