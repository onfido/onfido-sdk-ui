import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { mount } from 'enzyme'
import { EventEmitter2 } from 'eventemitter2'

import { useSdkOptions, SdkOptionsProvider } from '../useSdkOptions'
import type { NarrowSdkOptions } from '~types/commons'
import type { StepConfig } from '~types/steps'

const DummyComponent: FunctionComponent = () => {
  const options = useSdkOptions()
  const [step, setStep] = useState<StepConfig | undefined>(undefined)

  return (
    <div>
      <span data-sdk-options={options} data-step={step}>
        Options
      </span>
      <button onClick={() => setStep(options.findStep('document'))}>
        Find step
      </button>
    </div>
  )
}

describe('context', () => {
  describe('useSdkOptions', () => {
    it('throws error when no Providers wrapped', () => {
      expect(() => mount(<DummyComponent />)).toThrowError(
        `SDK options wasn't initialized!`
      )
    })

    it('gets correct options data', () => {
      const fakeOptions: NarrowSdkOptions = {
        token: 'fake-sdk-token',
        containerId: 'onfido-mount',
        language: 'fr',
        userDetails: {
          smsNumber: '+447495023357',
        },
        steps: [
          { type: 'welcome' },
          { type: 'document' },
          { type: 'face' },
          { type: 'complete' },
        ],
        events: new EventEmitter2(),
      }

      const wrapper = mount(
        <SdkOptionsProvider options={fakeOptions}>
          <DummyComponent />
        </SdkOptionsProvider>
      )

      const span = wrapper.find('DummyComponent span')
      expect(span.prop('data-sdk-options')).toMatchObject(fakeOptions)
      expect(span.prop('data-step')).toBeUndefined()
    })
  })
})
