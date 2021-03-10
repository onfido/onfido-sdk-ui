import { h, FunctionComponent } from 'preact'
import { SdkOptionsProvider } from '~contexts/useSdkOptions'

import type { NormalisedSdkOptions } from '~types/commons'

type Props = {
  options?: NormalisedSdkOptions
}

const MockedSdkOptionsProvider: FunctionComponent<Props> = ({
  children,
  options,
}) => (
  <SdkOptionsProvider options={options || {}}>{children}</SdkOptionsProvider>
)

export default MockedSdkOptionsProvider
