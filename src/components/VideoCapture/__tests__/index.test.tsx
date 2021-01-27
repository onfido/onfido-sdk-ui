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
  inactiveError: { name: 'LIVENESS_TIMEOUT' },
  onRedo: jest.fn(),
  onVideoCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
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

      renderFallback('fake_fallback_text')
      expect(defaultProps.renderFallback).toHaveBeenCalledWith(
        'fake_fallback_text'
      )
    })
  })
})
