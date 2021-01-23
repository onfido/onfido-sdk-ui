import { h } from 'preact'
import { shallow } from 'enzyme'

import App from '../index'

describe('App', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App options={{}} />)
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('ReduxAppWrapper').exists()).toBeTruthy()
  })
})
