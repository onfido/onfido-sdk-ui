import { h } from 'preact'
import { shallow } from 'enzyme'

import App from './index.js'

it('renders without crashing', () => {
  shallow(<App />)
})
