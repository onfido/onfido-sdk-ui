import { h } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import { mount, shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'

import ModalApp from '../ModalApp'

const mockStore = configureMockStore()
const mockState = {
  captures,
  globals,
}

describe('ModalApp', () => {
  it('renders without crashing', () => {
    const store = mockStore(mockState)

    const wrapper = shallow(
      <ReduxProvider store={store}>
        <ModalApp options={{}} />
      </ReduxProvider>
    )

    expect(wrapper.exists()).toBeTruthy()
  })

  /* it.skip('renders the front document capture', () => {
    const store = mockStore(mockState)

    const wrapper = mount(
      <ReduxProvider store={store}>
        <MockedLocalised>
          <ModalApp {...defaultProps} />
        </MockedLocalised>
      </ReduxProvider>
    )

    const documentLiveCapture = wrapper.find('DocumentLiveCapture')
    console.log(documentLiveCapture.debug())
  }) */
})
