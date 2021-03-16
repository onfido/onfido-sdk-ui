import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import VideoLayer, { Props as VideoLayerProps } from '../VideoLayer'

navigator.vibrate = jest.fn()

const defaultProps: VideoLayerProps = {
  documentType: 'passport',
  disableInteraction: false,
  instructionKeys: Array(3).fill({
    button: 'Fake button',
    title: 'Fake title',
  }),
  isRecording: false,
  onNext: jest.fn(),
  onStart: jest.fn(),
  onStop: jest.fn(),
  stepNumber: 0,
  totalSteps: 2,
}

const simulateNext = (wrapper: ReactWrapper) =>
  wrapper.find('.controls Button > button').simulate('click')

const assertSuccessState = (wrapper: ReactWrapper, isSuccess: boolean) => {
  expect(wrapper.find('.controls Button').exists()).toEqual(!isSuccess)
  expect(wrapper.find('.controls .success').exists()).toEqual(isSuccess)
}

const assertSuccessStep = (wrapper: ReactWrapper, lastStep = false) => {
  assertSuccessState(wrapper, true)
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
  assertSuccessState(wrapper, lastStep)
}

describe('DocumentVideo', () => {
  describe('VideoLayer', () => {
    beforeAll(() => {
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
    })

    describe('when recording', () => {
      it('renders items correctly', () => {
        const wrapper = mount(
          <MockedLocalised>
            <VideoLayer {...defaultProps} isRecording />
          </MockedLocalised>
        )

        expect(wrapper.find('Button').exists()).toBeTruthy()
        simulateNext(wrapper)
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

            simulateNext(wrapper)
            assertSuccessStep(wrapper, stepNumber === steps.length)
          })
        )
      })
    })
  })
})
