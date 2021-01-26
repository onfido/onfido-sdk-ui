import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import Recording from '../Recording'

const defaultProps = {
  onStop: jest.fn(),
}

describe('DocumentVideo', () => {
  describe('Recording', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(
        <MockedLocalised>
          <Recording {...defaultProps} />
        </MockedLocalised>
      )
      expect(wrapper.exists()).toBeTruthy()
    })

    it('renders instructions & button correctly', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Recording {...defaultProps} />
        </MockedLocalised>
      )

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeFalsy()
      expect(button.text()).toEqual(
        'doc_video_capture.button_stop_accessibility'
      )
    })

    it('disables button when disableInteraction=true', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Recording {...defaultProps} disableInteraction />
        </MockedLocalised>
      )

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeTruthy()
    })
  })
})
