import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import Instructions from '../Instructions'

const fakeTitle = 'Fake title'
const fakeSubtitle = 'Fake subtitle'

describe('DocumentVideo', () => {
  describe('reusables', () => {
    describe('Instructions', () => {
      it('renders without crashing', () => {
        const wrapper = shallow(<Instructions title={fakeTitle} />)
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('when mounted', () => {
        it('renders title correctly', () => {
          const wrapper = mount(<Instructions title={fakeTitle} />)
          const title = wrapper.find('.title')
          expect(title.exists()).toBeTruthy()
          expect(title.text()).toEqual(fakeTitle)
        })

        it('renders subtitle correctly', () => {
          const wrapper = mount(
            <Instructions title={fakeTitle} subtitle={fakeSubtitle} />
          )
          const title = wrapper.find('.title')
          expect(title.exists()).toBeTruthy()

          const subTitle = wrapper.find('.subtitle')
          expect(subTitle.exists()).toBeTruthy()
          expect(subTitle.text()).toEqual(fakeSubtitle)
        })
      })
    })
  })
})
