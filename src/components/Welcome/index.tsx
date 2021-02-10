import { h, FunctionComponent } from 'preact'
import { buildIteratorKey } from '~utils'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'
import ScreenLayout from '../Theme/ScreenLayout'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentWelcomeProps } from '~types/routers'

type Props = StepComponentWelcomeProps & WithLocalisedProps

const localisedDescriptions = (translate: TranslateCallback) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

type WelcomeContentProps = {
  descriptions: string[]
  translate: TranslateCallback
}

const WelcomeContent: FunctionComponent<WelcomeContentProps> = ({
  descriptions,
  translate,
}) => {
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

type WelcomeActionsProps = {
  nextButton?: string
  nextStep: () => void
  translate: TranslateCallback
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  nextButton,
  nextStep,
  translate,
}) => {
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

const Welcome: FunctionComponent<Props> = ({
  title,
  descriptions,
  nextButton,
  nextStep,
  translate,
}) => {
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
