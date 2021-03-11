import { h, ComponentType, FunctionComponent } from 'preact'
import type { WithCaptureVariantProps } from '~types/hocs'

function withCaptureVariant<P>(
  WrappedComponent: ComponentType<P>,
  additionalProps: WithCaptureVariantProps = {}
): ComponentType<P & WithCaptureVariantProps> {
  const WithCaptureVariant: FunctionComponent<P & WithCaptureVariantProps> = (
    props
  ) => <WrappedComponent {...props} {...additionalProps} />
  return WithCaptureVariant
}

export default withCaptureVariant
