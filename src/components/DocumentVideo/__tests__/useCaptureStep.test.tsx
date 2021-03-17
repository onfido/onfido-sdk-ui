import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useCaptureStep, { RecordState } from '../useCaptureStep'

import type { DocumentTypes } from '~types/steps'

type DummyProps = {
  documentType: DocumentTypes
}

const DummyComponent: FunctionComponent<DummyProps> = ({ documentType }) => {
  const {
    nextRecordState,
    nextStep,
    recordState,
    restart,
    stepNumber,
    totalSteps,
  } = useCaptureStep(documentType)

  return (
    <div>
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

const simulateNextRecordState = (wrapper: ShallowWrapper, times: number) => {
  const button = wrapper.find('#nextRecordState')
  Array(times)
    .fill(null)
    .forEach(() => button.simulate('click'))
}

const assertStep = (
  wrapper: ShallowWrapper,
  stepNumber: number,
  totalSteps: number
) => {
  wrapper.update()
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
  describe('useCaptureStep', () => {
    let wrapper: ShallowWrapper

    describe('with double-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="driving_licence" />)
      })

      it('returns intro step initially', () => assertStep(wrapper, 0, 2))

      it('moves to 1st step correctly', () => {
        simulateNextStep(wrapper, 1)
        assertStep(wrapper, 1, 2)
      })

      it('moves to 2nd step correctly', () => {
        simulateNextStep(wrapper, 2)
        assertStep(wrapper, 2, 2)
      })

      it('does nothing after last step', () => {
        simulateNextStep(wrapper, 3)
        assertStep(wrapper, 2, 2)
      })

      it('restarts correctly', () => {
        simulateNextStep(wrapper, 2)
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, 0, 2)
      })

      describe('during intro step', () => {
        it('returns showButton state initially', () => {
          assertRecordState(wrapper, 'showButton')
        })

        it('does nothing aftewards', () => {
          simulateNextRecordState(wrapper, 1)
          assertRecordState(wrapper, 'showButton')
        })
      })

      describe('during step later than intro', () => {
        beforeEach(() => {
          simulateNextStep(wrapper, 1)
        })

        it('returns hideButton state initially', () => {
          assertRecordState(wrapper, 'hideButton')
        })

        it('transits to showButton state correctly', () => {
          simulateNextRecordState(wrapper, 1)
          assertRecordState(wrapper, 'showButton')
        })

        it('transits to success state correctly', () => {
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
      })
    })

    describe('with single-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="passport" />)
      })

      it('returns intro step initially', () => assertStep(wrapper, 0, 1))

      it('moves to front step correctly', () => {
        simulateNextStep(wrapper, 1)
        assertStep(wrapper, 1, 1)
      })

      it('does nothing after last step', () => {
        simulateNextStep(wrapper, 2)
        assertStep(wrapper, 1, 1)
      })

      it('restarts correctly', () => {
        simulateNextStep(wrapper, 1)
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, 0, 1)
      })

      describe('during intro step', () => {
        it('returns showButton state initially', () => {
          assertRecordState(wrapper, 'showButton')
        })

        it('does nothing aftewards', () => {
          simulateNextRecordState(wrapper, 1)
          assertRecordState(wrapper, 'showButton')
        })
      })
    })
  })
})
