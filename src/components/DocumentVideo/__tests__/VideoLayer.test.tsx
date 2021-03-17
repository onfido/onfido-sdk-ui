import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import VideoLayer, { Props as VideoLayerProps } from '../VideoLayer'

navigator.vibrate = jest.fn()

const fakeInstructions = {
  button: 'fake_button_key',
  title: 'fake_title_key',
}

const defaultProps: VideoLayerProps = {
  documentType: 'passport',
  disableInteraction: false,
  instructionKeys: [
    fakeInstructions,
    { ...fakeInstructions, subtitle: 'fake_subtitle_key' },
    fakeInstructions,
  ],
  isRecording: false,
  onNext: jest.fn(),
  onStart: jest.fn(),
  onStop: jest.fn(),
  onSubmit: jest.fn(),
  stepNumber: 0,
  totalSteps: 2,
}

const simulateNext = (wrapper: ReactWrapper) =>
  wrapper.find('.controls Button > button').simulate('click')

const assertButton = (wrapper: ReactWrapper) => {
  expect(wrapper.find('Button').exists()).toBeFalsy()
  jest.runTimersToTime(3000)
  wrapper.update()
  expect(wrapper.find('Button').exists()).toBeTruthy()
}

const assertSuccessStep = (wrapper: ReactWrapper, lastStep = false) => {
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(navigator.vibrate).toHaveBeenCalledWith(500)

  jest.runTimersToTime(2000)

  if (lastStep) {
    expect(defaultProps.onStop).toHaveBeenCalled()
    expect(defaultProps.onStop).toHaveBeenCalledTimes(1)
    expect(defaultProps.onNext).not.toHaveBeenCalled()
  } else {
    expect(defaultProps.onNext).toHaveBeenCalled()
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1)
    expect(defaultProps.onStop).not.toHaveBeenCalled()
  }

  // Keep success state for the last step
  wrapper.update()
  expect(wrapper.find('.controls .success').exists()).toEqual(lastStep)
}

describe('DocumentVideo', () => {
  describe('VideoLayer', () => {
    beforeAll(() => {
      console.warn = jest.fn()
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedLocalised>
          <VideoLayer {...defaultProps} />
        </MockedLocalised>
      )

      expect(wrapper.find('Button').exists()).toBeTruthy()
      simulateNext(wrapper)
      expect(defaultProps.onStart).toHaveBeenCalled()
    })

    describe('when recording', () => {
      it('throws error on exceptional case', () => {
        // isRecording = true shouldn't come along with stepNumber = 0
        const wrapper = mount(
          <MockedLocalised>
            <VideoLayer {...defaultProps} isRecording />
          </MockedLocalised>
        )

        simulateNext(wrapper)
        expect(console.warn).toHaveBeenCalledWith(
          'handleNext is supposed to be called after intro step'
        )
      })

      it('renders items correctly', () => {
        const wrapper = mount(
          <MockedLocalised>
            <VideoLayer {...defaultProps} isRecording stepNumber={1} />
          </MockedLocalised>
        )

        assertButton(wrapper)
        simulateNext(wrapper)
        jest.runTimersToTime(2000)
        expect(defaultProps.onNext).toHaveBeenCalled()
      })

      describe('after intro step', () => {
        const steps = [1, 2]

        steps.forEach((stepNumber) =>
          it(`delays onNext to show success state when step=${stepNumber}`, () => {
            const wrapper = mount(
              <MockedLocalised>
                <VideoLayer
                  {...defaultProps}
                  isRecording
                  stepNumber={stepNumber}
                  totalSteps={steps.length}
                />
              </MockedLocalised>
            )

            assertButton(wrapper)
            simulateNext(wrapper)
            assertSuccessStep(wrapper, stepNumber === steps.length)
          })
        )
      })
    })
  })
})
