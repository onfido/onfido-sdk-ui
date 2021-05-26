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
  translate('welcome.description_p_3'),
]

type WelcomeContentProps = {
  customDescriptions?: string[]
}

const WelcomeContent: FunctionComponent<WelcomeContentProps> = ({
  customDescriptions,
}) => {
  const { translate } = useLocales()

  const welcomeDescriptions = customDescriptions
    ? customDescriptions
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
  customNextButtonLabel?: string
  nextStep: () => void
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  customNextButtonLabel,
  nextStep,
}) => {
  const { translate } = useLocales()

  const buttonLabel = customNextButtonLabel
    ? customNextButtonLabel
    : translate('welcome.next_button')

  return (
    <div className={theme.contentMargin}>
      <Button
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={nextStep}
        data-onfido-qa="welcome-next-btn"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

const Welcome: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const [, { findStep }] = useSdkOptions()
  const { translate } = useLocales()
  const {
    title: customTitle,
    descriptions: customDescriptions,
    nextButton: customNextButtonLabel,
  } = findStep('welcome')?.options || {}

  const actions = <WelcomeActions {...{ customNextButtonLabel, nextStep }} />
  const welcomeTitle = customTitle ? customTitle : translate('welcome.title')
  const welcomeSubTitle = !customDescriptions
    ? translate('welcome.subtitle')
    : ''

  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={welcomeTitle} subTitle={welcomeSubTitle} />
      <WelcomeContent {...{ customDescriptions }} />
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
