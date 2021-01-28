import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import StartRecording from '../StartRecording'

const defaultProps = {
  onClick: jest.fn(),
}

describe('DocumentVideo', () => {
  describe('StartRecording', () => {
    it('renders instructions & button correctly', () => {
      const wrapper = mount(
        <MockedLocalised>
          <StartRecording {...defaultProps} />
        </MockedLocalised>
      )

      expect(wrapper.find('Instructions .title').text()).toEqual(
        'doc_video_capture.instructions.video_intro_title'
      )
      expect(wrapper.find('Instructions .subtitle').text()).toEqual(
        'doc_video_capture.instructions.video_intro_subtitle'
      )

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeFalsy()
      expect(button.text()).toEqual(
        'doc_video_capture.button_record_accessibility'
      )

      button.simulate('click')
      expect(defaultProps.onClick).toHaveBeenCalled()
    })

    it('disables button when disableInteraction=true', () => {
      const wrapper = mount(
        <MockedLocalised>
          <StartRecording {...defaultProps} disableInteraction />
        </MockedLocalised>
      )

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeTruthy()
    })
  })
})
