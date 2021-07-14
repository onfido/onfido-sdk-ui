import { h, FunctionComponent } from 'preact'
import { LocaleContext } from '~locales'
import { parseTags } from '~utils'

import type { SupportedLanguages } from '~types/locales'

type Props = {
  language?: SupportedLanguages
}

export const mockedTranslate = jest.fn().mockImplementation((str) => str)

const MockedLocalised: FunctionComponent<Props> = ({
  children,
  language = 'en_US',
}) => (
  <LocaleContext.Provider
    value={{
      language,
      parseTranslatedTags: (key, handler) =>
        parseTags(mockedTranslate(key), handler),
      translate: mockedTranslate,
    }}
  >
    {children}
  </LocaleContext.Provider>
)

export default MockedLocalised
