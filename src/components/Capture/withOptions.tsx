import { h, ComponentType, FunctionComponent } from 'preact'

import type { DocumentSides } from '~types/commons'
import type { RequestedVariant } from '~types/steps'

export type Options = {
  forceCrossDevice?: boolean
  isPoA?: boolean
  requestedVariant?: RequestedVariant
  side?: DocumentSides
}

const withOptions = (
  WrappedComponent: ComponentType,
  additionalProps: Options = {}
): ComponentType<Options> => {
  const WithOptionComponent: FunctionComponent<Options> = (optionsAsProps) => (
    <WrappedComponent {...optionsAsProps} {...additionalProps} />
  )
  return WithOptionComponent
}

export default withOptions
