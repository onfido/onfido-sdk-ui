import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import VideoLayer, { Props as VideoLayerProps } from '../VideoLayer'

import type { CaptureFlows } from '~types/docVideo'

navigator.vibrate = jest.fn()

const defaultProps: VideoLayerProps = {
  captureFlow: 'cardId',
  disableInteraction: false,
  flowRestartTrigger: 0,
  footerHeightLimit: 300,
  isRecording: false,
  onStart: jest.fn(),
  onStop: jest.fn(),
  onSubmit: jest.fn(),
  renderOverlay: jest.fn().mockReturnValue(<div>Overlay</div>),
}

type MockedVideoCaptureProps = {
  captureFlow: CaptureFlows
  withRestartButton?: boolean
}

const MockedVideoCapture: FunctionComponent<MockedVideoCaptureProps> = ({
  captureFlow,
  withRestartButton = false,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [flowRestartTrigger, setFlowRestartTrigger] = useState(0)

  return (
    <MockedLocalised>
      <VideoLayer
        {...defaultProps}
        captureFlow={captureFlow}
        flowRestartTrigger={flowRestartTrigger}
        isRecording={isRecording}
        onStart={() => {
          defaultProps.onStart()
          setIsRecording(true)
        }}
        onStop={() => {
          defaultProps.onStop()
          setIsRecording(false)
        }}
      />
      {withRestartButton && (
        <button
          id="restartFlow"
          onClick={() =>
            setFlowRestartTrigger((prevTrigger) => prevTrigger + 1)
          }
        >
          Restart flow
        </button>
      )}
    </MockedLocalised>
  )
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

const findButton = (wrapper: ReactWrapper) =>
  wrapper.find({ 'data-onfido-qa': 'doc-video-capture-btn' })

const simulateNext = (wrapper: ReactWrapper) =>
  findButton(wrapper).simulate('click')

const assertButton = (wrapper: ReactWrapper) => {
  expect(findButton(wrapper).exists()).toBeFalsy()
  waitForTimeout(wrapper, 'button')
  expect(findButton(wrapper).exists()).toBeTruthy()
}

const assertHoldingState = (wrapper: ReactWrapper) => {
  expect(wrapper.find('.holdStill').exists()).toBeTruthy()
  expect(wrapper.find('.holdStill .text').text()).toEqual(
    'doc_video_capture.header_passport_progress'
  )
  expect(wrapper.find('.holdStill .loading').exists()).toBeTruthy()
  expect(wrapper.find('.controls .success').exists()).toBeFalsy()
  expect(findButton(wrapper).exists()).toBeFalsy()

  waitForTimeout(wrapper, 'holding')
  expect(wrapper.find('.holdStill').exists()).toBeFalsy()
}

const assertSuccessState = (wrapper: ReactWrapper, lastStep = false) => {
  expect(wrapper.find('.holdStill').exists()).toBeFalsy()
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(findButton(wrapper).exists()).toBeFalsy()
  expect(navigator.vibrate).toHaveBeenCalledWith(500)

  if (lastStep) {
    expect(defaultProps.onStop).toHaveBeenCalled()
    expect(defaultProps.onStop).toHaveBeenCalledTimes(1)
  } else {
    expect(defaultProps.onStop).not.toHaveBeenCalled()
  }

  waitForTimeout(wrapper, 'success')

  if (lastStep) {
    expect(defaultProps.onSubmit).toHaveBeenCalled()
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  } else {
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  }
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

      expect(findButton(wrapper).exists()).toBeTruthy()
      simulateNext(wrapper)
      expect(defaultProps.onStart).toHaveBeenCalled()
    })

    describe('when recording', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(<MockedVideoCapture captureFlow="cardId" />)
        simulateNext(wrapper)
      })

      it('hides button initially and displays after timeout', () =>
        assertButton(wrapper))

      it('shows success state after click', () => {
        waitForTimeout(wrapper, 'button')
        simulateNext(wrapper)
        assertSuccessState(wrapper)
      })

      it('hides success state after timeout', () => {
        waitForTimeout(wrapper, 'button')
        simulateNext(wrapper)
        waitForTimeout(wrapper, 'success')
        wrapper.setProps({})
        expect(wrapper.find('.controls .success').exists()).toBeFalsy()
      })
    })

    describe('with passports', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(<MockedVideoCapture captureFlow="passport" />)
        simulateNext(wrapper)
      })

      it('hides button initially and displays after timeout', () =>
        assertButton(wrapper))

      it('shows holdStill state after click', () => {
        waitForTimeout(wrapper, 'button')
        simulateNext(wrapper)
        assertHoldingState(wrapper)
      })

      it('shows success state after timeout', () => {
        waitForTimeout(wrapper, 'button')
        simulateNext(wrapper)
        waitForTimeout(wrapper, 'holding')
        assertSuccessState(wrapper, true)
      })
    })

    describe('when flow restart triggered', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(
          <MockedVideoCapture captureFlow="cardId" withRestartButton />
        )
        simulateNext(wrapper) // intro -> front
        waitForTimeout(wrapper, 'button')
        simulateNext(wrapper) // front -> back
      })

      it('restarts flow correctly', () => {
        wrapper.find('#restartFlow').simulate('click')
        wrapper.update()

        const stepProgress = wrapper.find('StepProgress')
        expect(stepProgress.props()).toMatchObject({
          stepNumber: 0,
          totalSteps: 2,
        })
      })
    })
  })
})
