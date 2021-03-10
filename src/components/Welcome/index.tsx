import { h, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { useSdkOptions } from '~contexts'
import { buildIteratorKey } from '~utils'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import { LocaleContext } from '../../locales'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'
import type { StepComponentBaseProps } from '~types/routers'
import type { StepConfigWelcome } from '~types/steps'

const localisedDescriptions = (translate: TranslateCallback) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

type WelcomeContentProps = {
  descriptions: string[]
}

const WelcomeContent: FunctionComponent<WelcomeContentProps> = ({
  descriptions,
}) => {
  const { translate } = useContext(LocaleContext)

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
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  nextButton,
  nextStep,
}) => {
  const { translate } = useContext(LocaleContext)

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

const Welcome: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const { steps } = useSdkOptions()
  const { translate } = useContext(LocaleContext)

  const { options } = steps.find(
    (step) => step.type === 'welcome'
  ) as StepConfigWelcome

  const { title, descriptions, nextButton } = options || {}

  const actions = <WelcomeActions {...{ nextButton, nextStep }} />
  const welcomeTitle = title ? title : translate('welcome.title')

  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={welcomeTitle} />
      <WelcomeContent {...{ descriptions, translate }} />
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
