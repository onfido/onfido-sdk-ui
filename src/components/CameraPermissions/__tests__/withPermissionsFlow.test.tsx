import { h, FunctionComponent } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { checkIfWebcamPermissionGranted } from '~utils'
import withPermissionsFlow from '../withPermissionsFlow'

import type { WithTrackingProps } from '~types/hocs'
import type { RenderFallbackProp } from '~types/routers'

jest.mock('../../utils', () => ({
  checkIfWebcamPermissionGranted: jest.fn(),
}))

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

const mockedCheck = checkIfWebcamPermissionGranted as jest.MockedFunction<
  typeof checkIfWebcamPermissionGranted
>

describe('CameraPermissions', () => {
  describe('Primer', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

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
      describe('when webcam permissions rejected', () => {
        beforeEach(() => {
          mockedCheck.mockImplementation((callback) => callback(false))
        })

        it('renders PermissionsPrimer', () => {
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

      describe('when webcam permissions granted', () => {
        beforeEach(() => {
          mockedCheck.mockImplementation((callback) => callback(true))
        })

        it('renders wrapped component', () => {
          const wrapper = mount(
            <MockedReduxProvider>
              <MockedLocalised>
                <WrappedComponent {...defaultProps} />
              </MockedLocalised>
            </MockedReduxProvider>
          )

          expect(wrapper.exists()).toBeTruthy()
          expect(wrapper.find(DummyComponent).exists()).toBeTruthy()
        })
      })
    })
  })
})
