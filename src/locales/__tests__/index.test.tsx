import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import { LocaleProvider } from '../index'

describe('locales', () => {
  describe('LocaleProvider', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(
        <LocaleProvider language="en_US">
          <span>Fake localised wrapped</span>
        </LocaleProvider>
      )
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders without crashing', () => {
        const wrapper = mount(
          <LocaleProvider language="en_US">
            <span>Fake localised wrapped</span>
          </LocaleProvider>
        )
        expect(wrapper.exists()).toBeTruthy()
      })
    })
  })
})
