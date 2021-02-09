import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useCaptureStep from '../useCaptureStep'

import type { DocumentTypes } from '~types/steps'

type DummyProps = {
  documentType: DocumentTypes
}

const DummyComponent: FunctionComponent<DummyProps> = ({ documentType }) => {
  const { step, stepNumber, totalSteps, nextStep, restart } = useCaptureStep(
    documentType
  )

  return (
    <div id="content" data-test={{ step, stepNumber, totalSteps }}>
      <button id="next" onClick={nextStep}>
        Next step
      </button>
      <button id="restart" onClick={restart}>
        Restart
      </button>
    </div>
  )
}

const assertStep = (
  wrapper: ShallowWrapper,
  matchObject: Record<string, unknown>
) => {
  wrapper.update()
  const data = wrapper.find('#content').prop('data-test')
  expect(data).toMatchObject(matchObject)
}

describe('DocumentVideo', () => {
  describe('useCaptureStep', () => {
    let wrapper: ShallowWrapper

    describe('with double-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="driving_licence" />)
      })

      it('returns intro step initially', () =>
        assertStep(wrapper, { step: 'intro', stepNumber: 0, totalSteps: 3 }))

      it('moves to front step correctly', () => {
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'front', stepNumber: 1, totalSteps: 3 })
      })

      it('moves to tilt step correctly', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'tilt', stepNumber: 2, totalSteps: 3 })
      })

      it('moves to back step correctly', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'back', stepNumber: 3, totalSteps: 3 })
      })

      it('does nothing after last step', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'back', stepNumber: 3, totalSteps: 3 })
      })

      it('restarts correctly', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, { step: 'intro', stepNumber: 0, totalSteps: 3 })
      })
    })

    describe('with single-sided documents', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent documentType="passport" />)
      })

      it('returns intro step initially', () =>
        assertStep(wrapper, { step: 'intro', stepNumber: 0, totalSteps: 2 }))

      it('moves to front step correctly', () => {
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'front', stepNumber: 1, totalSteps: 2 })
      })

      it('moves to tilt step correctly', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'tilt', stepNumber: 2, totalSteps: 2 })
      })

      it('does nothing after last step', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        assertStep(wrapper, { step: 'tilt', stepNumber: 2, totalSteps: 2 })
      })

      it('restarts correctly', () => {
        wrapper.find('#next').simulate('click')
        wrapper.find('#next').simulate('click')
        wrapper.find('#restart').simulate('click')
        assertStep(wrapper, { step: 'intro', stepNumber: 0, totalSteps: 2 })
      })
    })
  })
})
