import { h, FunctionComponent } from 'preact'
import { LocaleContext } from '~locales'

import type { SupportedLanguages } from '~types/locales'

type Props = {
  children: h.JSX.Element
  language?: SupportedLanguages
}

export const mockedTranslate = jest.fn().mockImplementation((str) => str)
export const parseTranslatedTags = jest.fn().mockImplementation((tag) => tag)

const MockedLocalised: FunctionComponent<Props> = ({
  children,
  language = 'en_US',
}) => (
  <LocaleContext.Provider
    value={{
      language,
      translate: mockedTranslate,
      parseTranslatedTags: mockedTranslate,
    }}
  >
    {children}
  </LocaleContext.Provider>
)

export default MockedLocalised
