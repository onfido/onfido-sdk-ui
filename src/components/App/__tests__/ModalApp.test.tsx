import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import ModalApp from '../ModalApp'

jest.mock('Tracker/safeWoopra')

describe('ModalApp', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedReduxProvider>
        <ModalApp options={{}} />
      </MockedReduxProvider>
    )

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('Connect(ModalApp)').exists()).toBeTruthy()
  })

  // @FIXME: mocks socket.io to make this work
  it.skip('renders the LocaleProvider', () => {
    const wrapper = mount(
      <MockedReduxProvider>
        <ModalApp options={{}} />
      </MockedReduxProvider>
    )

    expect(wrapper.exists()).toBeTruthy()
    console.log(wrapper.debug())
  })
})
