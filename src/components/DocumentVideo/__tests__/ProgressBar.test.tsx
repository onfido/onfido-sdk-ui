import { h } from 'preact'
import { mount } from 'enzyme'

import ProgressBar from '../ProgressBar'

const defaultProps = {
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

    describe('with active steps', () => {
      it(`renders correct steps when current step isn't finished yet`, () => {
        const wrapper = mount(<ProgressBar {...defaultProps} stepNumber={2} />)

        const steps = wrapper.find('.step')
        expect(steps.length).toEqual(defaultProps.totalSteps)
        expect(steps.at(0).hasClass('active')).toBeTruthy()
        expect(steps.at(1).hasClass('active')).toBeFalsy()
        expect(steps.at(2).hasClass('active')).toBeFalsy()
      })

      it(`renders correct steps when current step is finished`, () => {
        const wrapper = mount(
          <ProgressBar {...defaultProps} stepFinished stepNumber={2} />
        )

        const steps = wrapper.find('.step')
        expect(steps.length).toEqual(defaultProps.totalSteps)
        expect(steps.at(0).hasClass('active')).toBeTruthy()
        expect(steps.at(1).hasClass('active')).toBeTruthy()
        expect(steps.at(2).hasClass('active')).toBeFalsy()
      })
    })
  })
})
