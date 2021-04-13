import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import CaptureProgress from '../CaptureProgress'

const fakeTitle = 'Fake title'

describe('DocumentVideo', () => {
  describe('reusables', () => {
    describe('CaptureProgress', () => {
      it('renders without crashing', () => {
        const wrapper = shallow(<CaptureProgress />)
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('when mounted', () => {
        it('renders items correctly', () => {
          const wrapper = mount(<CaptureProgress />)
          expect(wrapper.find('.title').exists()).toBeFalsy()
          expect(wrapper.find('.loading .active').exists()).toBeTruthy()
          expect(wrapper.find('.loading .background').exists()).toBeTruthy()
        })

        it('renders title correctly', () => {
          const wrapper = mount(<CaptureProgress title={fakeTitle} />)
          expect(wrapper.find('.title').text()).toEqual(fakeTitle)
          expect(wrapper.find('.loading .active').exists()).toBeTruthy()
          expect(wrapper.find('.loading .background').exists()).toBeTruthy()
        })
      })
    })
  })
})
