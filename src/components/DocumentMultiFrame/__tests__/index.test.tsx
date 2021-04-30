import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedContainerDimensions from '~jest/MockedContainerDimensions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'
import DocumentMultiFrame, { Props as DocumentMultiFrameProps } from '../index'
import CaptureControls, {
  Props as CaptureControlsProps,
} from '../CaptureControls'

import type { DocumentSides } from '~types/commons'

jest.mock('~utils')

const defaultProps: DocumentMultiFrameProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  side: 'front',
  trackScreen: jest.fn(),
}

const assertCameraButton = (wrapper: ReactWrapper) => {
  const button = wrapper.find('CameraButton')
  expect(button.exists()).toBeTruthy()
  expect(button.prop('ariaLabel')).toEqual(
    'selfie_capture.button_accessibility'
  )
}

const assertDocumentOverlay = (
  wrapper: ReactWrapper,
  withPlaceholder: boolean
) => {
  const overlay = wrapper.find('DocumentOverlay')
  expect(overlay.exists()).toBeTruthy()
  expect(overlay.prop('withPlaceholder')).toEqual(withPlaceholder)
}

const assertVideoCapture = (wrapper: ReactWrapper) => {
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

  renderFallback({ text: 'Fake fallback action', type: 'fallback' })
  expect(defaultProps.renderFallback).toHaveBeenCalledWith({
    text: 'Fake fallback action',
    type: 'fallback',
  })
  trackScreen('fake_screen_tracking')
  expect(defaultProps.trackScreen).toHaveBeenCalledWith('fake_screen_tracking')
}

describe('DocumentMultiFrame', () => {
  const documentSides: DocumentSides[] = ['front', 'back']

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  documentSides.forEach((side) => {
    describe(`with ${side} side`, () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <MockedContainerDimensions>
                <DocumentMultiFrame {...defaultProps} side={side} />
              </MockedContainerDimensions>
            </MockedLocalised>
          </MockedReduxProvider>
        )
      })

      it('renders the video capture by default', () => {
        assertVideoCapture(wrapper)
        assertDocumentOverlay(wrapper, true)
        assertCameraButton(wrapper)
      })

      describe('when recording', () => {
        beforeEach(() => {
          wrapper.find('CameraButton > button').simulate('click')
          wrapper.update()
        })

        it('starts recording correctly', () =>
          assertDocumentOverlay(wrapper, false))

        it('submits payloads correctly', () => {
          // Recording stopped
          jest.advanceTimersToNextTimer()
          wrapper.setProps({})

          // Success state timed out
          jest.advanceTimersToNextTimer()
          wrapper.setProps({})

          expect(defaultProps.onCapture).toHaveBeenCalledWith({
            [side]: {
              blob: new Blob([]),
              sdkMetadata: {
                captureMethod: 'live',
                camera_name: 'fake-video-track',
                microphone_name: 'fake-audio-track',
              },
              filename: `document_${side}.jpeg`,
            },
            video: {
              blob: new Blob([]),
              sdkMetadata: {
                captureMethod: 'live',
                camera_name: 'fake-video-track',
                microphone_name: 'fake-audio-track',
              },
              filename: `document_${side}.webm`,
            },
          })
        })
      })
    })
  })

  describe('with empty payloads', () => {
    let wrapper: ReactWrapper

    const assertEmptySubmit = () => {
      const captureControls = wrapper.find<CaptureControlsProps>(
        CaptureControls
      )

      expect(() => {
        captureControls.props().onSubmit()
        wrapper.setProps({})
      }).toThrowError('Missing photoPayload or videoPayload')

      expect(defaultProps.onCapture).not.toHaveBeenCalled()
    }

    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <MockedContainerDimensions>
              <DocumentMultiFrame {...defaultProps} />
            </MockedContainerDimensions>
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it(`doesn't trigger onCapture`, assertEmptySubmit)

    describe('on redo', () => {
      beforeEach(() => {
        const videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
        videoCapture.props().onRedo()
      })

      it(`doesn't trigger onCapture`, assertEmptySubmit)
    })
  })
})
