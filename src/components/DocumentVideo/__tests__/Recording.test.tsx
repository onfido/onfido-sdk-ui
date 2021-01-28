import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import Recording, { Props as RecordingProps } from '../Recording'

const defaultProps: RecordingProps = {
  onNext: jest.fn(),
  onStop: jest.fn(),
}

describe('DocumentVideo', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Recording', () => {
    it('renders instructions correctly', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Recording {...defaultProps}>
            <div>
              <span className="title">doc_video.recording.title</span>
              <span className="subtitle">doc_video.recording.subtitle</span>
            </div>
          </Recording>
        </MockedLocalised>
      )

      expect(wrapper.find('.title').text()).toEqual('doc_video.recording.title')
      expect(wrapper.find('.subtitle').text()).toEqual(
        'doc_video.recording.subtitle'
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

    describe('with no more steps', () => {
      it('renders button correctly', () => {
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

        button.simulate('click')
        expect(defaultProps.onStop).toHaveBeenCalled()
        expect(defaultProps.onNext).not.toHaveBeenCalled()
      })
    })

    describe('with more steps', () => {
      it('renders button correctly', () => {
        const wrapper = mount(
          <MockedLocalised>
            <Recording {...defaultProps} hasMoreSteps />
          </MockedLocalised>
        )

        const button = wrapper.find('Button > button')
        expect(button.prop('disabled')).toBeFalsy()
        expect(button.text()).toEqual('doc_video_capture.button_primary_next')

        button.simulate('click')
        expect(defaultProps.onNext).toHaveBeenCalled()
        expect(defaultProps.onStop).not.toHaveBeenCalled()
      })
    })
  })
})
