import { h } from 'preact'
import { shallow } from 'enzyme'

import App from './index'

jest.mock('@onfido/castor-react', () => {
  return {
    __esModule: true,
    button: () => {
      return <div>Mock Button</div>
    },
  }
})

it('renders without crashing', () => {
  shallow(<App />)
})
