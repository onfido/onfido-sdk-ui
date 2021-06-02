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

const CAPTURE_STEP_TYPES: Set<string> = new Set([
  'document',
  'poa',
  'face',
  'auth',
])

const getLocalisedDescriptions = (
  configuredCaptureSteps: string[],
  translate: TranslateCallback
) => {
  const requiredLocalisedDescriptions = [
    translate('welcome.list_header_webcam'),
  ]
  const welcomeScreenLocalesMapping: Record<string, string> = {
    poa: translate('welcome.list_item_poa'), // TODO: more appropriate default copy
    document: translate('welcome.list_item_doc'),
    face: translate('welcome.list_item_selfie'),
    auth: translate('welcome.list_item_selfie'),
  }
  configuredCaptureSteps.forEach((idvStep) => {
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
  const configuredCaptureSteps = steps
    .filter((step) => CAPTURE_STEP_TYPES.has(step.type))
    .map((stepConfig) => stepConfig.type)
  const welcomeDescriptions = customDescriptions
    ? customDescriptions
    : getLocalisedDescriptions(configuredCaptureSteps, translate)

  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={welcomeTitle} subTitle={welcomeSubTitle} />
      <WelcomeContent {...{ welcomeDescriptions }} />
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
