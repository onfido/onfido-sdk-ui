import { h, ComponentType, FunctionComponent } from 'preact'

const withOptions = <P extends unknown>(
  WrappedComponent: ComponentType<P>,
  additionalProps: P = {} as P
): ComponentType<P> => {
  const WithOptionComponent: FunctionComponent<P> = (optionsAsProps) => (
    <WrappedComponent {...optionsAsProps} {...additionalProps} />
  )
  return WithOptionComponent
}

export default withOptions
