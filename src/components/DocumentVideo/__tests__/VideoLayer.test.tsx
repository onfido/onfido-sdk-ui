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
  wrapper.find('Button > button').simulate('click')

const assertSuccessStep = (wrapper: ReactWrapper) => {
  expect(defaultProps.onNext).not.toHaveBeenCalled()
  expect(wrapper.find('Button').exists()).toBeFalsy()
  expect(wrapper.find('.success').exists()).toBeTruthy()

  jest.runTimersToTime(2000)
  expect(defaultProps.onNext).toHaveBeenCalled()
  expect(defaultProps.onNext).toHaveBeenCalledTimes(1)

  wrapper.update()
  expect(wrapper.find('Button').exists()).toBeTruthy()
  expect(wrapper.find('.success').exists()).toBeFalsy()
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

        steps.forEach((step) =>
          it(`delays onNext to show success state when step=${step}`, () => {
            const wrapper = mount(
              <MockedLocalised>
                <VideoLayer {...defaultProps} isRecording step={step} />
              </MockedLocalised>
            )

            simulateNext(wrapper)
            assertSuccessStep(wrapper)
          })
        )
      })
    })
  })
})
