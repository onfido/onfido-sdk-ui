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

const getLocalisedDescriptions = (
  configuredIDVSteps: string[],
  translate: TranslateCallback
) => {
  const requiredLocalisedDescriptions = [translate('welcome.description_p_1')]
  const welcomeScreenLocalesMapping: Record<string, string> = {
    document: translate('welcome.description_p_2'),
    face: translate('welcome.description_p_3'),
  }
  configuredIDVSteps.forEach((idvStep) => {
    requiredLocalisedDescriptions.push(welcomeScreenLocalesMapping[idvStep])
  })
  return requiredLocalisedDescriptions
}

type WelcomeContentProps = {
  welcomeDescriptions: string[]
}

const WelcomeContent: FunctionComponent<WelcomeContentProps> = ({
  welcomeDescriptions,
}) => {
  return (
    <div className={style.text}>
      {welcomeDescriptions.map((description) => (
        <p key={`description_${buildIteratorKey(description)}`}>
          {description}
        </p>
      ))}
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

const Welcome: FunctionComponent<StepComponentBaseProps> = ({
  steps,
  nextStep,
}) => {
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

  const configuredIDVSteps = steps
    .filter((step) => step.type === 'document' || step.type === 'face')
    .map((stepConfig) => stepConfig.type)
  const welcomeDescriptions = customDescriptions
    ? customDescriptions
    : getLocalisedDescriptions(configuredIDVSteps, translate)

  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={welcomeTitle} subTitle={welcomeSubTitle} />
      <WelcomeContent {...{ welcomeDescriptions }} />
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
