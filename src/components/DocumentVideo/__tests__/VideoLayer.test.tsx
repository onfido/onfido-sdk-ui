import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import VideoLayer, { Props as VideoLayerProps } from '../VideoLayer'
import type { CaptureSteps } from '~types/docVideo'

const defaultProps: VideoLayerProps = {
  disableInteraction: false,
  isRecording: false,
  onNext: jest.fn(),
  onStart: jest.fn(),
  onStop: jest.fn(),
  step: 'intro',
  stepNumber: 0,
  subtitle: 'Fake subtitle',
  title: 'Fake title',
  totalSteps: 3,
}

const simulateNext = (wrapper: ReactWrapper) =>
  wrapper.find('.actions Button > button').simulate('click')

const assertSuccessState = (wrapper: ReactWrapper, isSuccess: boolean) => {
  expect(wrapper.find('.actions Button').exists()).toEqual(!isSuccess)
  expect(wrapper.find('.actions .success').exists()).toEqual(isSuccess)
}

const assertSuccessStep = (wrapper: ReactWrapper, lastStep = false) => {
  assertSuccessState(wrapper, true)

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
        const steps: CaptureSteps[] = ['front', 'tilt', 'back']

        steps.forEach((step, stepIndex) =>
          it(`delays onNext to show success state when step=${step}`, () => {
            const wrapper = mount(
              <MockedLocalised>
                <VideoLayer
                  {...defaultProps}
                  isRecording
                  step={step}
                  stepNumber={stepIndex + 1}
                />
              </MockedLocalised>
            )

            simulateNext(wrapper)
            assertSuccessStep(wrapper, step === 'back')
          })
        )
      })
    })
  })
})
