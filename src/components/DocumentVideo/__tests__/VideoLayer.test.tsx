import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import VideoLayer, { Props as VideoLayerProps } from '../VideoLayer'

navigator.vibrate = jest.fn()

const defaultProps: VideoLayerProps = {
  captureFlow: 'cardId',
  documentType: 'driving_licence',
  disableInteraction: false,
  isRecording: false,
  onStart: jest.fn(),
  onStop: jest.fn(),
  onSubmit: jest.fn(),
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

{
  /* const assertHoldingState = (wrapper: ReactWrapper) => {
  expect(wrapper.find('.holding').exists()).toBeTruthy()
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(wrapper.find('Button').exists()).toBeFalsy()

  waitForTimeout(wrapper, 'holding')
  expect(wrapper.find('.holding').exists()).toBeFalsy()
} */
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
  } else {
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
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(
          <MockedLocalised>
            <VideoLayer {...defaultProps} />
          </MockedLocalised>
        )

        simulateNext(wrapper)
      })

      it('hides button initially and displays after timeout', () =>
        assertButton(wrapper))

      it.only('shows success state after click', () => {
        console.log('invoke 1:', wrapper.find('VideoLayer .controls').debug())
        waitForTimeout(wrapper, 'button')
        console.log('invoke 2:', wrapper.find('VideoLayer .controls').debug())
        simulateNext(wrapper)
        console.log('invoke 3:', wrapper.find('VideoLayer .controls').debug())
        // assertSuccessState(wrapper)
      })
    })
  })
})
