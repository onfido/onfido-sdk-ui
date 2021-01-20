import { h, ComponentType, FunctionComponent } from 'preact'

import type { DocumentSides } from '~types/commons'
import type { RequestedVariant } from '~types/steps'

export type Options = {
  forceCrossDevice?: boolean
  isPoA?: boolean
  requestedVariant?: RequestedVariant
  side?: DocumentSides
}

const withOptions = <P extends unknown>(
  WrappedComponent: ComponentType<P>,
  additionalProps: Options = {}
): ComponentType<P & Options> => {
  const WithOptionComponent: FunctionComponent<P & Options> = (
    optionsAsProps
  ) => <WrappedComponent {...optionsAsProps} {...additionalProps} />
  return WithOptionComponent
}

export default withOptions
