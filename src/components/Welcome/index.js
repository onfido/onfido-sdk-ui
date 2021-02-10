import { h } from 'preact'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'
import { buildIteratorKey } from '~utils'
import theme from '../Theme/style.scss'
import style from './style.scss'

const localisedDescriptions = (translate) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

const WelcomeContent = ({ descriptions, translate }) => {
  const welcomeDescriptions = descriptions
    ? descriptions
    : localisedDescriptions(translate)

  return (
    <div>
      <div className={style.text}>
        {welcomeDescriptions.map((description) => (
          <p key={`description_${buildIteratorKey(description)}`}>
            {description}
          </p>
        ))}
      </div>
    </div>
  )
}

const WelcomeActions = ({ nextButton, nextStep, translate }) => {
  const welcomeNextButton = nextButton
    ? nextButton
    : translate('welcome.next_button')

  return (
    <div>
      <Button onClick={nextStep} variants={['centered', 'primary', 'lg']}>
        {welcomeNextButton}
      </Button>
    </div>
  )
}

const Welcome = ({ title, descriptions, nextButton, nextStep, translate }) => {
  const actions = <WelcomeActions {...{ nextButton, nextStep, translate }} />
  const welcomeTitle = title ? title : translate('welcome.title')
  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={welcomeTitle} />
      <WelcomeContent {...{ descriptions, translate }} />
    </ScreenLayout>
  )
}

export default trackComponent(localised(Welcome))
