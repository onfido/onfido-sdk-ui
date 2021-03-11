import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import Primer from '../Primer'

const defaultProps = {
  onNext: jest.fn(),
  trackScreen: jest.fn(),
}

describe('CameraPermissions', () => {
  describe('Primer', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<Primer {...defaultProps} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders without crashing', () => {
        const wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <Primer {...defaultProps} />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('PageTitle').exists()).toBeTruthy()
      })
    })
  })
})
