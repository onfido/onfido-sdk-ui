import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useRecordTransition from '../useRecordTransition'

import type { DocumentTypes } from '~types/steps'

type DummyProps = {
  documentType: DocumentTypes
  stepNumber: number
}

const DummyComponent: FunctionComponent<DummyProps> = ({
  documentType,
  stepNumber,
}) => {
  const { state, transit } = useRecordTransition(documentType, stepNumber)

  return (
    <div>
      <span id="state">{state}</span>
      <button id="transit" onClick={transit}>
        Transit
      </button>
    </div>
  )
}

const simulateTransit = (wrapper: ShallowWrapper) =>
  wrapper.find('#transit').simulate('click')

describe('DocumentVideo', () => {
  describe('useRecordTransition', () => {
    let wrapper: ShallowWrapper
    const docTypes: DocumentTypes[] = ['driving_licence', 'passport']

    docTypes.forEach((docType) => {
      describe(`during intro step - ${docType}`, () => {
        beforeEach(() => {
          wrapper = shallow(
            <DummyComponent documentType={docType} stepNumber={0} />
          )
        })

        it('returns showButton state initially', () => {
          expect(wrapper.find('#state').text()).toEqual('showButton')
        })

        it('does nothing aftewards', () => {
          simulateTransit(wrapper)
          expect(wrapper.find('#state').text()).toEqual('showButton')
        })
      })
    })

    describe('with double-sided documents', () => {
      const steps = [1, 2]

      steps.forEach((stepNumber) => {
        describe(`during step #${stepNumber}`, () => {
          beforeEach(() => {
            wrapper = shallow(
              <DummyComponent
                documentType="driving_licence"
                stepNumber={stepNumber}
              />
            )
          })

          it('returns hideButton state initially', () => {
            expect(wrapper.find('#state').text()).toEqual('hideButton')
          })

          it('does nothing with transit when in hideButton state', () => {
            simulateTransit(wrapper)
            expect(wrapper.find('#state').text()).toEqual('hideButton')
          })

          describe('when in showButton state', () => {
            beforeEach(() => {
              jest.runTimersToTime(3000)
              wrapper.update()
            })

            it('transits to showButton after delay', () => {
              expect(wrapper.find('#state').text()).toEqual('showButton')
            })

            it('transits to success after invoking transit', () => {
              simulateTransit(wrapper)
              expect(wrapper.find('#state').text()).toEqual('success')
            })

            it('does nothing aftewards', () => {
              simulateTransit(wrapper)
              simulateTransit(wrapper)
              expect(wrapper.find('#state').text()).toEqual('showButton')
            })
          })
        })
      })
    })

    describe('with single-sided documents', () => {
      describe('during 1st step', () => {
        beforeEach(() => {
          wrapper = shallow(
            <DummyComponent documentType="passport" stepNumber={1} />
          )
        })

        it('returns hideButton state initially', () => {
          expect(wrapper.find('#state').text()).toEqual('hideButton')
        })

        it('does nothing with transit when in hideButton state', () => {
          simulateTransit(wrapper)
          expect(wrapper.find('#state').text()).toEqual('hideButton')
        })

        describe('when in showButton state', () => {
          beforeEach(() => {
            jest.runTimersToTime(3000)
            wrapper.update()
          })

          it('transits to showButton after delay', () => {
            expect(wrapper.find('#state').text()).toEqual('showButton')
          })

          it('transits to holdStill after invoking transit', () => {
            simulateTransit(wrapper)
            expect(wrapper.find('#state').text()).toEqual('holdStill')
          })

          describe('when in holdStill state', () => {
            beforeEach(() => {
              simulateTransit(wrapper)
            })

            it('does nothing with transit when in holdStill state', () => {
              simulateTransit(wrapper)
              expect(wrapper.find('#state').text()).toEqual('holdStill')
            })

            it('transits to success after delay', () => {
              jest.runTimersToTime(6000)
              wrapper.update()
              expect(wrapper.find('#state').text()).toEqual('success')
            })

            it('does nothing aftewards', () => {
              jest.runTimersToTime(6000)
              wrapper.update()
              simulateTransit(wrapper)
              expect(wrapper.find('#state').text()).toEqual('showButton')
            })
          })
        })
      })
    })
  })
})
