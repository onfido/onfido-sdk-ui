import { h } from 'preact'
import { mount } from 'enzyme'

import Recording, { Props as RecordingProps } from '../Recording'

const defaultProps: RecordingProps = {
  buttonText: 'Fake button',
  onNext: jest.fn(),
  onStop: jest.fn(),
  stepNumber: 0,
  totalSteps: 3,
}

describe('DocumentVideo', () => {
  describe('Recording', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('renders items correctly', () => {
      const wrapper = mount(<Recording {...defaultProps} />)

      const progress = wrapper.find('ProgressBar')
      expect(progress.exists()).toBeTruthy()
      expect(progress.props()).toMatchObject({
        stepNumber: defaultProps.stepNumber,
        totalSteps: defaultProps.totalSteps,
      })

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeFalsy()
      expect(button.text()).toEqual(defaultProps.buttonText)

      button.simulate('click')
      expect(defaultProps.onNext).toHaveBeenCalled()
      expect(defaultProps.onStop).not.toHaveBeenCalled()
    })

    it('disables button when disableInteraction=true', () => {
      const wrapper = mount(<Recording {...defaultProps} disableInteraction />)

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeTruthy()
    })

    it('renders children correctly', () => {
      const wrapper = mount(
        <Recording {...defaultProps}>
          <div>
            <span className="title">Fake title</span>
            <span className="subtitle">Fake subtitle</span>
          </div>
        </Recording>
      )
      expect(wrapper.find('.title').text()).toEqual('Fake title')
      expect(wrapper.find('.subtitle').text()).toEqual('Fake subtitle')
    })

    describe('with no more steps', () => {
      it('renders button correctly', () => {
        const wrapper = mount(
          <Recording {...defaultProps} stepNumber={defaultProps.totalSteps} />
        )

        const button = wrapper.find('Button > button')
        expect(button.prop('disabled')).toBeFalsy()
        expect(button.text()).toEqual(defaultProps.buttonText)

        button.simulate('click')
        expect(defaultProps.onStop).toHaveBeenCalled()
        expect(defaultProps.onNext).not.toHaveBeenCalled()
      })
    })
  })
})
