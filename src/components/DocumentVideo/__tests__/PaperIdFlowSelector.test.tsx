import { h } from 'preact'
import { shallow } from 'enzyme'

import PaperIdFlowSelector from '../PaperIdFlowSelector'

describe('DocumentVideo', () => {
  describe('PaperIdFlowSelector', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<PaperIdFlowSelector />)
      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
