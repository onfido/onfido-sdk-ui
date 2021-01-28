import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-preact-pure'

jest.mock('../components/Modal/index.js', () => {
  return {
    getCSSMilisecsValue: () => '10ms',
  }
})

configure({ adapter: new Adapter() })
