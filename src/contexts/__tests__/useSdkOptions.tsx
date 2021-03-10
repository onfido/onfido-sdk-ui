import { h, FunctionComponent } from 'preact'
import { mount } from 'enzyme'

import { useSdkOptions, SdkOptionsProvider } from '../useSdkOptions'
import type { NormalisedSdkOptions } from '~types/commons'

const DummyComponent: FunctionComponent = () => {
  const options = useSdkOptions()

  return <span data-sdk-options={options}>Options</span>
}

describe('context', () => {
  describe('useSdkOptions', () => {
    it('throws error when no Providers wrapped', () => {
      expect(() => mount(<DummyComponent />)).toThrowError(
        `SDK options wasn't initialized!`
      )
    })

    it('gets correct options data', () => {
      const fakeOptions: NormalisedSdkOptions = {
        token: 'fake-sdk-token',
        containerId: 'onfido-mount',
        language: 'fr',
        userDetails: {
          smsNumber: '+44765432109',
        },
        steps: [
          { type: 'welcome' },
          { type: 'document' },
          { type: 'face' },
          { type: 'complete' },
        ],
      }

      const wrapper = mount(
        <SdkOptionsProvider options={fakeOptions}>
          <DummyComponent />
        </SdkOptionsProvider>
      )

      const span = wrapper.find('DummyComponent > span')
      expect(span.prop('data-sdk-options')).toMatchObject(fakeOptions)
    })
  })
})
