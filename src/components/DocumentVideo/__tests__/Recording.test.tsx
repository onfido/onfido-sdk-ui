import { h } from 'preact'
import { mount } from 'enzyme'

import Recording, { Props as RecordingProps } from '../Recording'

const defaultProps: RecordingProps = {
  buttonText: 'Fake button',
  onNext: jest.fn(),
  onStop: jest.fn(),
}

describe('DocumentVideo', () => {
  describe('Recording', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('renders instructions correctly', () => {
      const wrapper = mount(
        <Recording {...defaultProps}>
          <div>
            <span className="title">doc_video.recording.title</span>
            <span className="subtitle">doc_video.recording.subtitle</span>
          </div>
        </Recording>
      )

      expect(wrapper.find('.title').text()).toEqual('doc_video.recording.title')
      expect(wrapper.find('.subtitle').text()).toEqual(
        'doc_video.recording.subtitle'
      )
    })

    it('disables button when disableInteraction=true', () => {
      const wrapper = mount(<Recording {...defaultProps} disableInteraction />)

      const button = wrapper.find('Button > button')
      expect(button.prop('disabled')).toBeTruthy()
    })

    describe('with no more steps', () => {
      it('renders button correctly', () => {
        const wrapper = mount(<Recording {...defaultProps} />)

        const button = wrapper.find('Button > button')
        expect(button.prop('disabled')).toBeFalsy()
        expect(button.text()).toEqual(defaultProps.buttonText)

        button.simulate('click')
        expect(defaultProps.onStop).toHaveBeenCalled()
        expect(defaultProps.onNext).not.toHaveBeenCalled()
      })
    })

    describe('with more steps', () => {
      it('renders button correctly', () => {
        const wrapper = mount(<Recording {...defaultProps} hasMoreSteps />)

        const button = wrapper.find('Button > button')
        expect(button.prop('disabled')).toBeFalsy()
        expect(button.text()).toEqual(defaultProps.buttonText)

        button.simulate('click')
        expect(defaultProps.onNext).toHaveBeenCalled()
        expect(defaultProps.onStop).not.toHaveBeenCalled()
      })
    })
  })
})
