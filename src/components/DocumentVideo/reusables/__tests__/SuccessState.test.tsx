import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import SuccessState from '../SuccessState'
import { SdkOptionsProvider } from '~contexts/useSdkOptions'

const fakeAriaLabel = 'Fake aria-label'

describe('DocumentVideo', () => {
  describe('reusables', () => {
    describe('SuccessState', () => {
      it('renders without crashing', () => {
        const wrapper = shallow(
          <SdkOptionsProvider options={{ steps: [] }}>
            <SuccessState ariaLabel={fakeAriaLabel} />
          </SdkOptionsProvider>
        )
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('when mounted', () => {
        it('renders items correctly', () => {
          const wrapper = mount(
            <SdkOptionsProvider options={{ steps: [] }}>
              <SuccessState ariaLabel={fakeAriaLabel} />
            </SdkOptionsProvider>
          )
          expect(wrapper.find('.successIcon').exists()).toBeTruthy()
          const aria = wrapper.find('.ariaLabel')
          expect(aria.text()).toEqual(fakeAriaLabel)
          expect(aria.prop('aria-label')).toEqual(fakeAriaLabel)
        })
      })
    })
  })
})
