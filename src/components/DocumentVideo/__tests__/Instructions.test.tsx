import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import Instructions from '../Instructions'

const defaultProps = {
  title: 'Fake title',
}

describe('DocumentVideo', () => {
  describe('Instructions', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<Instructions {...defaultProps} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    it('renders title correctly', () => {
      const wrapper = mount(<Instructions {...defaultProps} />)
      const title = wrapper.find('span')
      expect(title.exists()).toBeTruthy()
      expect(title.text()).toEqual(defaultProps.title)
    })
  })
})
