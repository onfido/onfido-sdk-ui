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
import type { StepComponentBaseProps } from '~types/routers'
import type { StepTypes } from '~types/steps'

const CAPTURE_STEP_TYPES: Set<StepTypes> = new Set([
  'document',
  'poa',
  'face',
  'data',
  'auth',
  'activeVideo',
])

type WelcomeActionsProps = {
  customNextButtonLabel?: string
  nextStep: () => void
  useWorkflow?: boolean
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  customNextButtonLabel,
  nextStep,
  useWorkflow,
}) => {
  const { translate } = useLocales()
  const buttonLabel = customNextButtonLabel
    ? customNextButtonLabel
    : translate(
        `${
          useWorkflow ? 'welcome.start_workflow_button' : 'welcome.next_button'
        }`
      )

  return (
    <div className={theme.contentMargin}>
      <Button
        type="button"
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
  autoFocusOnInitialScreenTitle,
}) => {
  const [{ useWorkflow }, { findStep }] = useSdkOptions()
  const { translate } = useLocales()

  const welcomeStep = findStep('welcome')
  const {
    title: customTitle,
    descriptions: customDescriptions,
    nextButton: customNextButtonLabel,
  } = welcomeStep?.options || {}
  const isFirstScreen = steps[0].type === 'welcome'

  const documentStep = findStep('document')
  const forDocVideo = documentStep?.options?.requestedVariant === 'video'

  const actions = (
    <WelcomeActions {...{ customNextButtonLabel, nextStep, useWorkflow }} />
  )
  const welcomeTitle = customTitle || translate('welcome.title')
  const welcomeSubTitle = !customDescriptions
    ? translate('welcome.subtitle')
    : ''
  const captureSteps = steps
    .filter((step) => CAPTURE_STEP_TYPES.has(step.type))
    .map((stepConfig) => stepConfig.type)

  return (
    <ScreenLayout
      actions={actions}
      className={style.container}
      pageId={'Welcome'}
    >
      <PageTitle
        title={welcomeTitle}
        subTitle={welcomeSubTitle}
        shouldAutoFocus={isFirstScreen && autoFocusOnInitialScreenTitle}
      />
      {useWorkflow ? (
        <div className={style.balanceContainer}>
          <div className={style.balance} />
        </div>
      ) : forDocVideo ? (
        <DocVideoContent captureSteps={captureSteps} />
      ) : (
        <DefaultContent
          captureSteps={captureSteps}
          descriptions={customDescriptions}
        />
      )}
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
