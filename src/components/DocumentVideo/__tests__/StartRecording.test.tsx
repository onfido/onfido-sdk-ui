import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import StartRecording from '../StartRecording'

const defaultProps = {
  onClick: jest.fn(),
  totalSteps: 3,
}

describe('DocumentVideo', () => {
  describe('StartRecording', () => {
    it('renders instructions & button correctly', () => {
      const wrapper = mount(
        <MockedLocalised>
          <StartRecording {...defaultProps} />
        </MockedLocalised>
      )

      const progress = wrapper.find('ProgressBar')
      expect(progress.exists()).toBeTruthy()
      expect(progress.prop('totalSteps')).toEqual(defaultProps.totalSteps)

      const button = wrapper.find('Button > button')
      expect(button.exists()).toBeTruthy()
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
