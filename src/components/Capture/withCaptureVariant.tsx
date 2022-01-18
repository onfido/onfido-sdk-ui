import { h, ComponentType, FunctionComponent } from 'preact'
import type { WithCaptureVariantProps, WithPageIdProps } from '~types/hocs'

function withCaptureVariant<P>(
  WrappedComponent: ComponentType<P>,
  additionalProps: WithCaptureVariantProps & WithPageIdProps = {}
): ComponentType<P & WithCaptureVariantProps> {
  const WithCaptureVariant: FunctionComponent<P & WithCaptureVariantProps> = (
    props
  ) => <WrappedComponent {...props} {...additionalProps} />
  return WithCaptureVariant
}

export default withCaptureVariant
