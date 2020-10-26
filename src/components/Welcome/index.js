import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import { Button } from '@onfido/castor'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

const localisedDescriptions = (translate) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

// Generate Base64 string from description to use as key in iterator
const buildDescriptionKey = (description) => btoa(description)

const Welcome = ({ title, descriptions, nextButton, nextStep, translate }) => {
  const welcomeTitle = title ? title : translate('welcome.title')
  const welcomeDescriptions = descriptions
    ? descriptions
    : localisedDescriptions(translate)
  const welcomeNextButton = nextButton
    ? nextButton
    : translate('welcome.next_button')
  return (
    <div>
      <PageTitle title={welcomeTitle} />
      <div className={theme.thickWrapper}>
        <div className={style.text}>
          {welcomeDescriptions.map((description) => (
            <p key={`description_${buildDescriptionKey(description)}`}>
              {description}
            </p>
          ))}
        </div>
        <Button
          variant="primary"
          size="large" // REMOVE
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="welcome-next-btn"
        >
          {welcomeNextButton}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Welcome))
