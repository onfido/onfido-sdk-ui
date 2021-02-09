import { h } from 'preact'
import { mount } from 'enzyme'

import ProgressBar from '../ProgressBar'

const defaultProps = {
  stepNumber: 0,
  totalSteps: 3,
}

describe('DocumentVideo', () => {
  describe('ProgressBar', () => {
    it('renders steps without active ones', () => {
      const wrapper = mount(<ProgressBar {...defaultProps} />)

      const container = wrapper.find('.progress')
      expect(container.exists()).toBeTruthy()

      const steps = container.find('.step')
      expect(steps.length).toEqual(defaultProps.totalSteps)
      expect(steps.at(0).hasClass('active')).toBeFalsy()
      expect(steps.at(1).hasClass('active')).toBeFalsy()
      expect(steps.at(2).hasClass('active')).toBeFalsy()
    })

    it('renders steps with active ones', () => {
      const wrapper = mount(<ProgressBar {...defaultProps} stepNumber={2} />)

      const steps = wrapper.find('.step')
      expect(steps.length).toEqual(defaultProps.totalSteps)
      expect(steps.at(0).hasClass('active')).toBeTruthy()
      expect(steps.at(1).hasClass('active')).toBeTruthy()
      expect(steps.at(2).hasClass('active')).toBeFalsy()
    })
  })
})
