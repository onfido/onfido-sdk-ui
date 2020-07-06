import { h } from 'preact'
import PageTitle from '../PageTitle'
import theme from '../Theme/style.css'
import style from './style.css'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import {localised} from '../../locales'

import Autocomplete from 'accessible-autocomplete/preact'
import 'accessible-autocomplete/dist/accessible-autocomplete.min.css'

const countries = [
  'France',
  'Germany',
  'United Kingdom',
  'Malawi',
  'Malaysia',
  'Madagascar'
]
const suggest = (query, populateResults) => {
  const results = countries
  const filteredResults = results.filter(result => result.toLowerCase().includes(query.toLowerCase()))
  populateResults(filteredResults)
}

const localisedDescriptions = translate =>
  [translate('welcome.description_p_1'), translate('welcome.description_p_2')]

const Welcome = ({title, descriptions, nextButton, nextStep, translate}) => {
  const welcomeTitle = title ? title : translate('welcome.title')
  const welcomeDescriptions = descriptions ? descriptions : localisedDescriptions(translate)
  const welcomeNextButton = nextButton ? nextButton : translate('welcome.next_button')
  // FIXME: default, custom dropdownArrow not visible
  // NOTE: if cssNamespace is defined, this overrides the BEM block name used in default CSS,
  //       will need to rewrite the CSS class names to use specified block name
  return (
    <div>
      <PageTitle title={welcomeTitle} />
      <div className={theme.thickWrapper}>
        <div className={style.text}>
          {welcomeDescriptions.map(description => <p>{description}</p>)}
        </div>
        <div className={style.select}>
          <label for='accessible-autocomplete'>Search for country</label>
          <Autocomplete
            id='accessible-autocomplete'
            // cssNamespace={style.countrySelect}
            required={true}
            source={suggest}
            minLength={2}
            dropdownArrow={() => `<i class="${style.caretIcon}"><i/>`}
            displayMenu="overlay"
            templates={{
              suggestion: (suggestion) => {
                return suggestion &&
                  `<i role="presentation" class="${style.flagIcon}"></i>
                  <span class="${style.countryLabel}">${suggestion}</span>`
              }
            }}
            onConfirm={selected => console.log('* Country selected:',selected)} />
          <br />
        </div>
        <Button onClick={nextStep} variants={['centered', 'primary', 'lg']}>
          {welcomeNextButton}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Welcome))
