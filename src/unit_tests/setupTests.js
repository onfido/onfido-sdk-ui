import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-preact-pure'
import fetch from 'jest-fetch-mock'

fetch.enableMocks()

configure({ adapter: new Adapter() })
