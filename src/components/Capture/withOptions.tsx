import { h, ComponentType, FunctionComponent } from 'preact'
import type { WithOptionsProps } from '~types/hocs'

const withOptions = <P extends unknown>(
  WrappedComponent: ComponentType<P>,
  additionalProps: WithOptionsProps = {}
): ComponentType<P & WithOptionsProps> => {
  const WithOptionComponent: FunctionComponent<P & WithOptionsProps> = (
    optionsAsProps
  ) => <WrappedComponent {...optionsAsProps} {...additionalProps} />
  return WithOptionComponent
}

export default withOptions
