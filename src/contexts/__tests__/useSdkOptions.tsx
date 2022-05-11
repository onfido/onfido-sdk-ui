import { h, FunctionComponent } from 'preact'
import { mount } from 'enzyme'
import { EventEmitter2 } from 'eventemitter2'

import { useSdkOptions, SdkOptionsProvider } from '../useSdkOptions'
import type { NarrowSdkOptions } from '~types/commons'
import type { StepTypes } from '~types/steps'

type DummyProps = {
  step?: StepTypes
}

/**
 * In real situations, there shouldn't be such a `step` prop
 * passed down to the consuming component.
 * This is only a convenient way to create a test environment for this hook
 */
const DummyComponent: FunctionComponent<DummyProps> = ({ step }) => {
  const [options, { findStep }] = useSdkOptions()
  const currentStep = step ? findStep(step) : undefined

  return (
    <span data-sdk-options={options} data-step={currentStep}>
      Options
    </span>
  )
}

const defaultOptions: NarrowSdkOptions = {
  token: 'fake-sdk-token',
  containerId: 'onfido-mount',
  language: 'fr',
  userDetails: {
    smsNumber: '+447495023357',
  },
  steps: [
    { type: 'welcome' },
    { type: 'document', options: { forceCrossDevice: true } },
    { type: 'face' },
    { type: 'complete' },
    { type: 'retry' },
  ],
  events: new EventEmitter2(),
}

describe('context', () => {
  describe('useSdkOptions', () => {
    it('throws error when no Providers wrapped', () => {
      expect(() => mount(<DummyComponent />)).toThrowError(
        `SDK options wasn't initialized!`
      )
    })

    it('gets correct options data', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <DummyComponent />
        </SdkOptionsProvider>
      )

      const span = wrapper.find('DummyComponent > span')
      expect(span.prop('data-sdk-options')).toMatchObject(defaultOptions)
      expect(span.prop('data-step')).toBeUndefined()
    })

    it('gets correct step config', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <DummyComponent step="document" />
        </SdkOptionsProvider>
      )

      const span = wrapper.find('DummyComponent > span')
      expect(span.prop('data-step')).toMatchObject({
        type: 'document',
        options: { forceCrossDevice: true },
      })
    })

    it(`gets no step when options doesn't include passed type`, () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <DummyComponent step="userConsent" />
        </SdkOptionsProvider>
      )

      const span = wrapper.find('DummyComponent > span')
      expect(span.prop('data-step')).toBeUndefined()
    })
  })
})
