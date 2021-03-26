import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised, { mockedTranslate } from '~jest/MockedLocalised'
import StepProgress from '../StepProgress'

mockedTranslate.mockImplementation((str) => {
  if (str === 'doc_video_capture.stepper') {
    return '<hidden>Invisible</hidden>step: <step></step> - total: <total></total>'
  }

  return str
})

describe('DocumentVideo', () => {
  describe('CaptureControls', () => {
    describe('StepProgress', () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      it(`doesn't render when totalSteps < 2`, () => {
        const wrapper = mount(
          <MockedLocalised>
            <StepProgress totalSteps={1} />
          </MockedLocalised>
        )

        expect(wrapper.find('StepProgress').children().exists()).toBeFalsy()
      })

      it(`doesn't render when stepNumber < 1`, () => {
        const wrapper = mount(
          <MockedLocalised>
            <StepProgress stepNumber={0} totalSteps={2} />
          </MockedLocalised>
        )

        expect(wrapper.find('StepProgress').children().exists()).toBeFalsy()
      })

      describe('with more totalSteps', () => {
        const steps = [1, 2]
        const totalSteps = steps.length

        steps.forEach((stepNumber) => {
          it('renders correct step numbers', () => {
            const wrapper = mount(
              <MockedLocalised>
                <StepProgress stepNumber={stepNumber} totalSteps={totalSteps} />
              </MockedLocalised>
            )

            expect(wrapper.find('StepProgress').text()).toEqual(
              `step: ${stepNumber} - total: ${totalSteps}`
            )
          })
        })
      })
    })
  })
})
