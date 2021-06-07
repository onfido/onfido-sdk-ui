import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import { useSdkOptions } from '~contexts'
import { useLocales } from '~locales'
import theme from 'components/Theme/style.scss'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import { DefaultContent, DocVideoContent } from './Content'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'
import type { StepComponentBaseProps } from '~types/routers'
import type { StepTypes } from '~types/steps'

const CAPTURE_STEP_TYPES: Set<StepTypes> = new Set([
  'document',
  'poa',
  'face',
  'auth',
])

const getLocalisedDescriptions = (
  configuredCaptureSteps: StepTypes[],
  translate: TranslateCallback
) => {
  const requiredLocalisedDescriptions = [
    translate('welcome.list_header_webcam'),
  ]
  const welcomeScreenLocalesMapping: Partial<Record<StepTypes, string>> = {
    poa: translate('welcome.list_item_poa'),
    document: translate('welcome.list_item_doc'),
    face: translate('welcome.list_item_selfie'),
    auth: translate('welcome.list_item_selfie'),
  }
  configuredCaptureSteps.forEach((idvStep) => {
    const localeString = welcomeScreenLocalesMapping[idvStep]
    if (localeString) {
      requiredLocalisedDescriptions.push(localeString)
    }
  })
  return requiredLocalisedDescriptions
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

  const welcomeStep = findStep('welcome')
  const {
    title: customTitle,
    descriptions: customDescriptions,
    nextButton: customNextButtonLabel,
  } = welcomeStep?.options || {}

  const documentStep = findStep('document')
  const forDocVideo = documentStep?.options?.requestedVariant === 'video'

  const actions = <WelcomeActions {...{ customNextButtonLabel, nextStep }} />
  const welcomeTitle = customTitle || translate('welcome.title')
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
    <ScreenLayout actions={actions} className={style.container}>
      <PageTitle title={welcomeTitle} subTitle={welcomeSubTitle} />
      {forDocVideo ? (
        <DocVideoContent />
      ) : (
        <DefaultContent descriptions={welcomeDescriptions} />
      )}
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
