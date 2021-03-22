import { h, FunctionComponent } from 'preact'
import { useCallback } from 'preact/compat'
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
    <Button
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      onClick={nextStep}
      data-onfido-qa="welcome-next-btn"
    >
      {welcomeNextButton}
    </Button>
  )
}

const Welcome: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const [, { findStep }] = useSdkOptions()
  const { translate } = useLocales()

  const welcomeStep = findStep('welcome')
  const { title, descriptions, nextButton } = welcomeStep?.options || {}

  const documentStep = findStep('document')
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
