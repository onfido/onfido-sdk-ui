import { h, FunctionComponent } from 'preact'
import { mount, shallow } from 'enzyme'

import withCaptureVariant from '../withCaptureVariant'
import type { WithCaptureVariantProps } from '~types/hocs'

const DummyComponent: FunctionComponent = () => <span>Dummy component</span>

describe('Capture', () => {
  describe('withCaptureVariant', () => {
    it('renders without crashing', () => {
      const WrappedComponent = withCaptureVariant(DummyComponent)
      const wrapper = shallow(<WrappedComponent />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders wrapped component no additional props by default', () => {
        const WrappedComponent = withCaptureVariant(DummyComponent)
        const wrapper = mount(<WrappedComponent />)
        expect(wrapper.exists()).toBeTruthy()

        const wrappedComponent = wrapper.find('DummyComponent')
        expect(wrappedComponent.exists()).toBeTruthy()
        expect(wrappedComponent.props()).toMatchObject({})
      })

      it('renders wrapped component correctly with additional props', () => {
        const additionalProps: WithCaptureVariantProps = {
          forceCrossDevice: true,
          requestedVariant: 'video',
          side: 'back',
        }
        const WrappedComponent = withCaptureVariant(
          DummyComponent,
          additionalProps
        )
        const wrapper = mount(<WrappedComponent />)
        expect(wrapper.exists()).toBeTruthy()

        const wrappedComponent = wrapper.find('DummyComponent')
        expect(wrappedComponent.exists()).toBeTruthy()
        expect(wrappedComponent.props()).toMatchObject(additionalProps)
      })
    })
  })
})
