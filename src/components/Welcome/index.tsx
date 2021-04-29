import { h, FunctionComponent } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import { useSdkOptions } from '~contexts'
import { buildIteratorKey } from '~utils'
import { useLocales } from '~locales'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'
import type { StepComponentBaseProps } from '~types/routers'

const localisedDescriptions = (translate: TranslateCallback) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

type WelcomeContentProps = {
  descriptions?: string[]
}

const WelcomeContent: FunctionComponent<WelcomeContentProps> = ({
  descriptions,
}) => {
  const { translate } = useLocales()

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
  const { translate } = useLocales()

  const welcomeNextButton = nextButton
    ? nextButton
    : translate('welcome.next_button')

  console.warn('TODO: Revert this change! For testing only!')

  return (
    <div className={theme.contentMargin}>
      <Button
        variant="secondary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={nextStep}
        data-onfido-qa="welcome-next-btn"
      >
        <span className={style.icon} />
        <span className={style.text2}>{welcomeNextButton}</span>
        <span className={style.icon} />
      </Button>
    </div>
  )
}

const Welcome: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const [, { findStep }] = useSdkOptions()
  const { translate } = useLocales()
  const { title, descriptions, nextButton } = findStep('welcome')?.options || {}

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
