import { h, FunctionComponent } from 'preact'
import { useCallback } from 'preact/compat'

import { useSdkOptions } from '~contexts'
import { useLocales } from '~locales'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import { DefaultContent, DocVideoContent } from './Content'
import style from './style.scss'

import type { StepComponentBaseProps } from '~types/routers'
import type { StepConfigWelcome, StepConfigDocument } from '~types/steps'

type WelcomeActionsProps = {
  forDocVideo?: boolean
  nextButton?: string
  nextStep: () => void
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  forDocVideo,
  nextButton,
  nextStep,
}) => {
  const { translate } = useLocales()

  const defaultButton = forDocVideo
    ? translate('doc_video_capture.welcome.next_button')
    : translate('welcome.next_button')
  const welcomeNextButton = nextButton || defaultButton

  return (
    <Button onClick={nextStep} variants={['centered', 'primary', 'lg']}>
      {welcomeNextButton}
    </Button>
  )
}

const Welcome: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const { steps } = useSdkOptions()
  const { translate } = useLocales()

  const welcomeStep = steps.find(
    (step) => step.type === 'welcome'
  ) as StepConfigWelcome

  const { title, descriptions, nextButton } = welcomeStep?.options || {}

  const documentStep = steps.find(
    (step) => step.type === 'document'
  ) as StepConfigDocument

  const forDocVideo = documentStep?.options?.requestedVariant === 'video'

  const actions = <WelcomeActions {...{ forDocVideo, nextButton, nextStep }} />

  const getTitle = useCallback(() => {
    if (title) {
      return title
    }

    return forDocVideo
      ? translate('doc_video_capture.welcome.title')
      : translate('welcome.title')
  }, [title, forDocVideo, translate])

  return (
    <ScreenLayout actions={actions} className={style.container}>
      <PageTitle title={getTitle()} />
      {forDocVideo ? (
        <DocVideoContent />
      ) : (
        <DefaultContent {...{ descriptions, translate }} />
      )}
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
