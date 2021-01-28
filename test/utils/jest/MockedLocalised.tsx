import { h, FunctionComponent } from 'preact'
import { LocaleContext } from '~locales'

import type { SupportedLanguages } from '~types/locales'

type Props = {
  language?: SupportedLanguages
}

export const mockedTranslate = jest.fn().mockImplementation((str) => str)
export const mockedParseTranslatedTags = jest
  .fn()
  .mockImplementation((key, handler) => [handler({ type: key, text: key })])

const MockedLocalised: FunctionComponent<Props> = ({
  children,
  language = 'en_US',
}) => (
  <LocaleContext.Provider
    value={{
      language,
      parseTranslatedTags: mockedParseTranslatedTags,
      translate: mockedTranslate,
    }}
  >
    {children}
  </LocaleContext.Provider>
)

export default MockedLocalised
