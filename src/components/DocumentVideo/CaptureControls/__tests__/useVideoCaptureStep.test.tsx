import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useCaptureStep from '../useVideoCaptureStep'

import type { CaptureFlows, CaptureSteps, RecordState } from '~types/docVideo'

type DummyProps = {
  captureFlow: CaptureFlows
}

const DummyComponent: FunctionComponent<DummyProps> = ({ captureFlow }) => {
  const {
    captureStep,
    nextRecordState,
    nextStep,
    recordState,
    restart,
    stepNumber,
    totalSteps,
  } = useCaptureStep(captureFlow)

  return (
    <div>
      <span id="captureStep">{captureStep}</span>
      <span id="stepNumber">{stepNumber}</span>
      <span id="totalSteps">{totalSteps}</span>
      <span id="recordState">{recordState}</span>
      <button id="nextStep" onClick={nextStep}>
        Next step
      </button>
      <button id="nextRecordState" onClick={nextRecordState}>
        Next subState
      </button>
      <button id="restart" onClick={restart}>
        Restart
      </button>
    </div>
  )
}

const simulateNextStep = (wrapper: ShallowWrapper, times: number) => {
  const button = wrapper.find('#nextStep')
  Array(times)
    .fill(null)
    .forEach(() => button.simulate('click'))
}

const simulateRestart = (wrapper: ShallowWrapper) =>
  wrapper.find('#restart').simulate('click')

const simulateNextRecordState = (wrapper: ShallowWrapper, times: number) => {
  const button = wrapper.find('#nextRecordState')
  Array(times)
    .fill(null)
    .forEach(() => button.simulate('click'))
}

const assertCaptureStep = (
  wrapper: ShallowWrapper,
  captureStep: CaptureSteps,
  stepNumber: number,
  totalSteps: number
) => {
  wrapper.update()
  expect(wrapper.find('#captureStep').text()).toEqual(captureStep)
  expect(wrapper.find('#stepNumber').text()).toEqual(String(stepNumber))
  expect(wrapper.find('#totalSteps').text()).toEqual(String(totalSteps))
}

const assertRecordState = (
  wrapper: ShallowWrapper,
  recordState: RecordState
) => {
  wrapper.update()
  expect(wrapper.find('#recordState').text()).toEqual(recordState)
}

describe('DocumentVideo', () => {
  describe('CaptureControls', () => {
    describe('useCaptureStep', () => {
      let wrapper: ShallowWrapper

      describe('with card ID documents', () => {
        beforeEach(() => {
          wrapper = shallow(<DummyComponent captureFlow="cardId" />)
        })

        it('returns intro step initially', () =>
          assertCaptureStep(wrapper, 'intro', 0, 2))

        it('moves to 1st step correctly', () => {
          simulateNextStep(wrapper, 1)
          assertCaptureStep(wrapper, 'front', 1, 2)
        })

        it('moves to 2nd step correctly', () => {
          simulateNextStep(wrapper, 2)
          assertCaptureStep(wrapper, 'back', 2, 2)
        })

        it('does nothing after last step', () => {
          simulateNextStep(wrapper, 3)
          assertCaptureStep(wrapper, 'back', 2, 2)
        })

        it('restarts flow correctly', () => {
          simulateNextStep(wrapper, 2)
          simulateRestart(wrapper)
          assertCaptureStep(wrapper, 'intro', 0, 2)
        })

        describe('during intro step', () => {
          it('returns showButton state initially', () => {
            assertRecordState(wrapper, 'showButton')
          })

          it('does nothing afterwards', () => {
            simulateNextRecordState(wrapper, 1)
            assertRecordState(wrapper, 'showButton')
          })

          it('restarts flow correctly', () => {
            simulateRestart(wrapper)
            assertRecordState(wrapper, 'showButton') // restart to intro step
          })
        })

        describe('during 1st step', () => {
          beforeEach(() => {
            simulateNextStep(wrapper, 1)
          })

          it('returns hideButton state initially', () => {
            assertRecordState(wrapper, 'hideButton')
          })

          it('transitions to showButton state correctly', () => {
            simulateNextRecordState(wrapper, 1)
            assertRecordState(wrapper, 'showButton')
          })

          it('transitions to success state correctly', () => {
            simulateNextRecordState(wrapper, 2)
            assertRecordState(wrapper, 'success')
          })

          it('does nothing when triggering nextRecordState again', () => {
            simulateNextRecordState(wrapper, 3)
            assertRecordState(wrapper, 'success')
          })

          it('restarts correctly when moving to next step', () => {
            simulateNextRecordState(wrapper, 2) // to success state
            simulateNextStep(wrapper, 1)
            assertRecordState(wrapper, 'hideButton')
          })

          it('restarts flow correctly', () => {
            simulateNextRecordState(wrapper, 2)
            simulateRestart(wrapper)
            assertRecordState(wrapper, 'showButton') // restart to intro step
          })
        })
      })

      describe('with passports', () => {
        beforeEach(() => {
          wrapper = shallow(<DummyComponent captureFlow="passport" />)
        })

        it('returns intro step initially', () =>
          assertCaptureStep(wrapper, 'intro', 0, 1))

        it('moves to front step correctly', () => {
          simulateNextStep(wrapper, 1)
          assertCaptureStep(wrapper, 'front', 1, 1)
        })

        it('does nothing after last step', () => {
          simulateNextStep(wrapper, 2)
          assertCaptureStep(wrapper, 'front', 1, 1)
        })

        it('restarts flow correctly', () => {
          simulateNextStep(wrapper, 1)
          simulateRestart(wrapper)
          assertCaptureStep(wrapper, 'intro', 0, 1)
        })

        describe('during intro step', () => {
          it('returns showButton state initially', () => {
            assertRecordState(wrapper, 'showButton')
          })

          it('does nothing aftewards', () => {
            simulateNextRecordState(wrapper, 1)
            assertRecordState(wrapper, 'showButton')
          })

          it('restarts flow correctly', () => {
            simulateRestart(wrapper)
            assertRecordState(wrapper, 'showButton') // restart to intro step
          })
        })

        describe('during 1st step', () => {
          beforeEach(() => {
            simulateNextStep(wrapper, 1)
          })

          it('returns hideButton state initially', () => {
            assertRecordState(wrapper, 'hideButton')
          })

          it('transitions to showButton state correctly', () => {
            simulateNextRecordState(wrapper, 1)
            assertRecordState(wrapper, 'showButton')
          })

          it('transitions to holdStill state correctly', () => {
            simulateNextRecordState(wrapper, 2)
            assertRecordState(wrapper, 'holdStill')
          })

          it('transitions to success state correctly', () => {
            simulateNextRecordState(wrapper, 3)
            assertRecordState(wrapper, 'success')
          })

          it('does nothing when triggering nextRecordState again', () => {
            simulateNextRecordState(wrapper, 4)
            assertRecordState(wrapper, 'success')
          })

          it('restarts flow correctly', () => {
            simulateNextRecordState(wrapper, 3)
            simulateRestart(wrapper)
            assertRecordState(wrapper, 'showButton') // restart to intro step
          })
        })
      })
    })
  })
})
