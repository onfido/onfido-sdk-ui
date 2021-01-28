import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import PageTitle from '../index'

const defaultProps = {
  title: 'Fake title',
}

describe('PageTitle', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<PageTitle {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <PageTitle {...defaultProps} />
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('.titleSpan').text()).toEqual(defaultProps.title)
    })
  })
})
