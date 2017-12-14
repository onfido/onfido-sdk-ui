import {es} from './es'
import {en} from './en'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
// Example: 'en-UK'
const locales = {
  en,
  es
}

export default locales
