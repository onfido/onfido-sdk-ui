import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedContainerDimensions from '~jest/MockedContainerDimensions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'
import DocumentMultiFrame, { Props as DocumentMultiFrameProps } from '../index'

jest.mock('~utils')

const defaultProps: DocumentMultiFrameProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  side: 'front',
  trackScreen: jest.fn(),
}

const assertCameraButton = (wrapper: ReactWrapper<VideoCaptureProps>) => {
  const button = wrapper.find('CameraButton')
  expect(button.exists()).toBeTruthy()
  expect(button.prop('ariaLabel')).toEqual(
    'selfie_capture.button_accessibility'
  )
}

const assertVideoCapture = (wrapper: ReactWrapper) => {
  const videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
  expect(videoCapture.exists()).toBeTruthy()
  expect(wrapper.find('PaperIdFlowSelector').exists()).toBeFalsy()

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

  assertCameraButton(videoCapture)
}

describe('DocumentMultiFrame', () => {
  let wrapper: ReactWrapper

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  describe('with double-sided documents', () => {
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

    it('renders the video capture by default', () =>
      assertVideoCapture(wrapper))
  })

  describe('with passports', () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <MockedContainerDimensions>
              <DocumentMultiFrame {...defaultProps} documentType="passport" />
            </MockedContainerDimensions>
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertVideoCapture(wrapper))
  })
})
