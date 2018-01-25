import Polyglot from 'node-polyglot'

import {en} from './en'
import {es} from './es'
import {en as enMobile} from './mobileLocales/en'
import {es as esMobile} from './mobileLocales/es'
import { isDesktop } from '../components/utils'

const defaultLocaleTag = 'en'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTransations = {en, es}

const mobileTranslations = {
  en: enMobile,
  es: esMobile
}

const defaultLanguage = () => {
  const defaultPhrases = availableTransations[defaultLocaleTag]
  const polyglot = new Polyglot({phrases: defaultLocaleTag, onMissingKey: () => null})
  polyglot.extend(defaultPhrases)
  if (!isDesktop) polyglot.extend(mobileTranslations[defaultLocaleTag])
  return polyglot
}

export const initializeI18n = (language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  if (typeof(language) === 'string') {
    if (availableTransations[language]) {
      polyglot.extend(availableTransations[language])
      if (!isDesktop) { polyglot.extend(mobileTranslations[language]) }
    }
    else {
      console.warn('Locale not supported')
    }
  }
  else if (language.locale) {
    polyglot.extend(language.phrases)
    if (!isDesktop) { polyglot.extend(language.mobilePhrases) }
  }
  return polyglot
}
