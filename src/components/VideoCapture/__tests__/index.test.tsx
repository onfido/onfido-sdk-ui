import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import VideoCapture, { Props as VideoCaptureProps } from '../index'

jest.mock('../../CameraPermissions/withPermissionsFlow')

const defaultProps: VideoCaptureProps = {
  inactiveError: { name: 'LIVENESS_TIMEOUT' },
  onRedo: jest.fn(),
  onVideoCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

describe('VideoCapture', () => {
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
    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <VideoCapture {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('Camera').exists()).toBeTruthy()
    })
  })
})
