import { h } from 'preact'
// import { Provider as ReduxProvider } from 'react-redux'
import { mount, shallow } from 'enzyme'
// import configureMockStore from 'redux-mock-store'

// import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
// import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'

import MockedLocalised from '~jest/MockedLocalised'
import DocumentVideo, { DocumentVideoProps } from '../index'
// const mockStore = configureMockStore()
// const mockState = {
// captures,
// globals,
// }

describe('DocumentVideo', () => {
  const defaultProps: DocumentVideoProps = {
    documentType: 'driving_licence',
    renderFallback: jest.fn(),
    trackScreen: jest.fn(),
  }

  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedLocalised>
        <DocumentVideo {...defaultProps} />
      </MockedLocalised>
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  it.skip('renders the front document capture', () => {
    // const store = mockStore(mockState)

    const wrapper = mount(
      <MockedLocalised>
        <DocumentVideo {...defaultProps} />
      </MockedLocalised>
    )

    // const documentLiveCapture = wrapper.find('DocumentLiveCapture')
    console.log(wrapper.debug())
  })
})
