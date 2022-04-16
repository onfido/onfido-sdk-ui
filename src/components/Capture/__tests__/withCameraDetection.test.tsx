import { h, FunctionComponent } from 'preact'
import { mount, ReactWrapper } from 'enzyme'
import enumerateDevices from 'enumerate-devices'

import { mockedReduxProps } from '~jest/MockedReduxProvider'
import withCameraDetection from '../withCameraDetection'

import type { WithCameraDetectionProps } from '~types/hocs'
import type { ReduxProps } from '~types/routers'

const runAllPromises = () => new Promise(setImmediate)

const mockedEnumerateDevices = enumerateDevices as jest.MockedFunction<
  typeof enumerateDevices
>

const DummyComponent: FunctionComponent<
  ReduxProps & WithCameraDetectionProps
> = () => <span>Dummy component</span>
const WrappedComponent = withCameraDetection(DummyComponent)

const assertWrappedComponent = async (
  wrapper: ReactWrapper,
  hasCamera: boolean
) => {
  await runAllPromises()
  wrapper.update()
  const wrappedComponent = wrapper.find('DummyComponent')
  expect(wrappedComponent.exists()).toBeTruthy()
  expect(wrappedComponent.prop('hasCamera')).toEqual(hasCamera)
}

describe('Capture', () => {
  describe('withCameraDetection', () => {
    let wrapper: ReactWrapper

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('with no cameras', () => {
      beforeEach(() => {
        mockedEnumerateDevices.mockResolvedValue([])
        wrapper = mount(<WrappedComponent {...mockedReduxProps} />)
      })

      it('renders nothing by default', () => {
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('DummyComponent').exists()).toBeFalsy()
      })

      it('renders wrapped component with hasCamera=false', () =>
        assertWrappedComponent(wrapper, false))
    })

    describe('with valid camera', () => {
      beforeEach(() => {
        mockedEnumerateDevices.mockResolvedValue([{ kind: 'videoinput' }])
        wrapper = mount(<WrappedComponent {...mockedReduxProps} />)
      })

      it('renders nothing by default', () => {
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('DummyComponent').exists()).toBeFalsy()
      })

      it('renders wrapped component with hasCamera=true', () =>
        assertWrappedComponent(wrapper, true))
    })
  })
})
