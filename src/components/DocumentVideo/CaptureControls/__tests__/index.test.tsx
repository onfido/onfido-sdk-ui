import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import CaptureControls from '../index'

import type { CaptureFlows } from '~types/docVideo'

navigator.vibrate = jest.fn()

const defaultProps = {
  captureFlow: 'cardId' as CaptureFlows,
  flowRestartTrigger: 0,
  onStepChange: jest.fn(),
  onSubmit: jest.fn(),
}

type MockedDocumentVideoProps = {
  captureFlow: CaptureFlows
  withRestartButton?: boolean
}

const MockedDocumentVideo: FunctionComponent<MockedDocumentVideoProps> = ({
  captureFlow,
  withRestartButton = false,
}) => {
  const [flowRestartTrigger, setFlowRestartTrigger] = useState(0)

  return (
    <MockedLocalised>
      <MockedVideoCapture
        renderVideoOverlay={(props) => (
          <CaptureControls
            {...props}
            captureFlow={captureFlow}
            flowRestartTrigger={flowRestartTrigger}
            onSubmit={defaultProps.onSubmit}
          />
        )}
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
  expect(wrapper.find('CaptureProgress').exists()).toBeTruthy()
  expect(wrapper.find('CaptureProgress').text()).toEqual(
    'doc_video_capture.header_passport_progress'
  )
  expect(wrapper.find('CaptureProgress .loading').exists()).toBeTruthy()
  expect(wrapper.find('.controls .success').exists()).toBeFalsy()
  expect(findButton(wrapper).exists()).toBeFalsy()

  waitForTimeout(wrapper, 'holding')
  expect(wrapper.find('CaptureProgress').exists()).toBeFalsy()
}

const assertSuccessState = (wrapper: ReactWrapper, lastStep = false) => {
  expect(wrapper.find('CaptureProgress').exists()).toBeFalsy()
  expect(wrapper.find('.controls .success').exists()).toBeTruthy()
  expect(findButton(wrapper).exists()).toBeFalsy()
  expect(navigator.vibrate).toHaveBeenCalledWith(500)

  waitForTimeout(wrapper, 'success')

  if (lastStep) {
    expect(defaultProps.onSubmit).toHaveBeenCalled()
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  } else {
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  }
}

describe('DocumentVideo', () => {
  describe('CaptureControls', () => {
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
          <MockedVideoCapture
            renderVideoOverlay={(props) => (
              <CaptureControls {...props} {...defaultProps} />
            )}
          />
        </MockedLocalised>
      )

      expect(findButton(wrapper).exists()).toBeTruthy()
      simulateNext(wrapper)
      expect(defaultProps.onStepChange).toHaveBeenCalled()
    })

    describe('when recording', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(<MockedDocumentVideo captureFlow="cardId" />)
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
        wrapper = mount(<MockedDocumentVideo captureFlow="passport" />)
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
          <MockedDocumentVideo captureFlow="cardId" withRestartButton />
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
