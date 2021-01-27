import { h, FunctionComponent } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import withPermissionsFlow from '../withPermissionsFlow'
import type { WithTrackingProps } from '~types/hocs'
import type { RenderFallbackProp } from '~types/routers'

type DummyProps = {
  renderFallback: RenderFallbackProp
} & WithTrackingProps

const DummyComponent: FunctionComponent<DummyProps> = () => (
  <span>Wrapped component</span>
)

const WrappedComponent = withPermissionsFlow(DummyComponent)

const defaultProps = {
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

describe('CameraPermissions', () => {
  describe('Primer', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(
        <MockedReduxProvider>
          <MockedLocalised>
            <WrappedComponent {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders without crashing', () => {
        const wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <WrappedComponent {...defaultProps} />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('Permissions').exists()).toBeTruthy()
      })
    })
  })
})
