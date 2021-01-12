import { h } from 'preact'
import { shallow } from 'enzyme'

import App from './index'

it('renders without crashing', () => {
  shallow(<App options={{}} />)
})
