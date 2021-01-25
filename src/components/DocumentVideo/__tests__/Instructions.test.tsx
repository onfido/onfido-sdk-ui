import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import Instructions from '../Instructions'

const fakeTitle = 'Fake title'
const fakeSubtitle = 'Fake subtitle'

describe('DocumentVideo', () => {
  describe('Instructions', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<Instructions title={fakeTitle} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    it('renders title correctly', () => {
      const wrapper = mount(<Instructions title={fakeTitle} />)
      const title = wrapper.find('span')
      expect(title.length).toEqual(1)
      expect(title.exists()).toBeTruthy()
      expect(title.text()).toEqual(fakeTitle)
    })

    it('renders subtitle correctly', () => {
      const wrapper = mount(
        <Instructions title={fakeTitle} subtitle={fakeSubtitle} />
      )
      const texts = wrapper.find('span')
      expect(texts.length).toEqual(2)
      expect(texts.at(0).text()).toEqual(fakeTitle)
      expect(texts.at(1).text()).toEqual(fakeSubtitle)
    })
  })
})
