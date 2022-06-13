import { h } from 'preact'
import { shallow } from 'enzyme'

import { mockedReduxProps } from '~jest/MockedReduxProvider'

import { Props as CountrySelectorProps } from '../index'
import IdentityCountrySelector from '../IdentityCountrySelector'

const defaultProps: CountrySelectorProps = {
  documentType: 'driving_licence',
  idDocumentIssuingCountry: {
    country_alpha2: 'AR',
    country_alpha3: 'ARG',
    name: 'Argentina',
  },
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  resetSdkFocus: jest.fn(),
  language: 'en_US',
  parseTranslatedTags: jest.fn(),
  translate: jest.fn(),
  trackScreen: jest.fn(),
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  componentsList: [],
  step: 0,
  stepIndexType: 'user',
  steps: [{ type: 'document' }],
  triggerOnError: jest.fn(),
  hasCamera: true,
  allowCrossDeviceFlow: true,
  completeStep: jest.fn(),
  ...mockedReduxProps,
}

describe('CountrySelector', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<IdentityCountrySelector {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })
})
