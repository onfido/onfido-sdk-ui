import { h, FunctionComponent } from 'preact'
import { LocaleProvider } from '~locales'

import type { SupportedLanguages } from '~types/locales'

type Props = {
  children: h.JSX.Element
  language?: SupportedLanguages
}

const MockedLocalised: FunctionComponent<Props> = ({ children }) => (
  <LocaleProvider language="en_US">{children}</LocaleProvider>
)

export default MockedLocalised
