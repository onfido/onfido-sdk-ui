import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useCaptureStep from '../useCaptureStep'

import type { DocumentTypes } from '~types/steps'

type DummyProps = {
  documentType: DocumentTypes
}

const DummyComponent: FunctionComponent<DummyProps> = ({ documentType }) => {
  const { stepNumber, totalSteps, nextStep, restart } = useCaptureStep(
    documentType
  )

  return (
    <div>
      <span id="stepNumber">{stepNumber}</span>
      <span id="totalSteps">{totalSteps}</span>
      <button id="next" onClick={nextStep}>
        Next step
      </button>
      <button id="restart" onClick={restart}>
        Restart
      </button>
    </div>
  )
}

const simulateNext = (wrapper: ShallowWrapper, times: number) => {
  const button = wrapper.find('#next')
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

describe('DocumentVideo', () => {
  describe('useCaptureStep', () => {
    let wrapper: ShallowWrapper

    describe('with double-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="driving_licence" />)
      })

      it('returns intro step initially', () => assertStep(wrapper, 0, 2))

      it('moves to 1st step correctly', () => {
        simulateNext(wrapper, 1)
        assertStep(wrapper, 1, 2)
      })

      it('moves to 2nd step correctly', () => {
        simulateNext(wrapper, 2)
        assertStep(wrapper, 2, 2)
      })

      it('does nothing after last step', () => {
        simulateNext(wrapper, 3)
        assertStep(wrapper, 2, 2)
      })

      it('restarts correctly', () => {
        simulateNext(wrapper, 2)
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, 0, 2)
      })
    })

    describe('with single-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="passport" />)
      })

      it('returns intro step initially', () => assertStep(wrapper, 0, 1))

      it('moves to front step correctly', () => {
        simulateNext(wrapper, 1)
        assertStep(wrapper, 1, 1)
      })

      it('does nothing after last step', () => {
        simulateNext(wrapper, 2)
        assertStep(wrapper, 1, 1)
      })

      it('restarts correctly', () => {
        simulateNext(wrapper, 1)
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, 0, 1)
      })
    })
  })
})
