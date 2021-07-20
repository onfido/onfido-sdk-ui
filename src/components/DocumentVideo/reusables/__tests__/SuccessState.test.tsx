import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import SuccessState from '../SuccessState'

const fakeAriaLabel = 'Fake aria-label'

describe('DocumentVideo', () => {
  describe('reusables', () => {
    describe('SuccessState', () => {
      it('renders without crashing', () => {
        const wrapper = shallow(<SuccessState ariaLabel={fakeAriaLabel} />)
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('when mounted', () => {
        it('renders items correctly', () => {
          const wrapper = mount(<SuccessState ariaLabel={fakeAriaLabel} />)
          expect(wrapper.find('.success').exists()).toBeTruthy()
          const aria = wrapper.find('.ariaLabel')
          expect(aria.text()).toEqual(fakeAriaLabel)
          expect(aria.prop('aria-label')).toEqual(fakeAriaLabel)
        })
      })
    })
  })
})
