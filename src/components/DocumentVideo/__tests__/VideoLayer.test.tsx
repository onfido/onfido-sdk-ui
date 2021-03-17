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
  documentType: 'driving_licence',
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

const waitForTimeout = (
  wrapper: ReactWrapper,
  type: 'button' | 'holding' | 'success'
) => {
  switch (type) {
    case 'button':
      jest.runTimersToTime(3000)
      break
    case 'holding':
      jest.runTimersToTime(6000)
      break
    case 'success':
      jest.runTimersToTime(2000)
      break
    default:
      break
  }

  wrapper.update()
}

const simulateNext = (wrapper: ReactWrapper) =>
  wrapper.find('.controls Button > button').simulate('click')

const assertButton = (wrapper: ReactWrapper) => {
  expect(wrapper.find('Button').exists()).toBeFalsy()
  waitForTimeout(wrapper, 'button')
  expect(wrapper.find('Button').exists()).toBeTruthy()
}

const assertHoldingState = (wrapper: ReactWrapper) => {
  expect(wrapper.find('.holding').exists()).toBeTruthy()
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(wrapper.find('Button').exists()).toBeFalsy()

  waitForTimeout(wrapper, 'holding')
  expect(wrapper.find('.holding').exists()).toBeFalsy()
}

const assertSuccessState = (wrapper: ReactWrapper, lastStep = false) => {
  expect(wrapper.find('.holding').exists()).toBeFalsy()
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(wrapper.find('Button').exists()).toBeFalsy()
  expect(navigator.vibrate).toHaveBeenCalledWith(500)

  waitForTimeout(wrapper, 'success')

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
        waitForTimeout(wrapper, 'success')
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
            assertSuccessState(wrapper, stepNumber === steps.length)
          })
        )
      })

      describe('for passport', () => {
        it('shows holding progress and then success state', () => {
          const wrapper = mount(
            <MockedLocalised>
              <VideoLayer
                {...defaultProps}
                documentType="passport"
                isRecording
                stepNumber={1}
                totalSteps={1}
              />
            </MockedLocalised>
          )

          assertButton(wrapper)
          simulateNext(wrapper)

          assertHoldingState(wrapper)
          assertSuccessState(wrapper, true)
        })
      })
    })
  })
})
