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

type WelcomeActionsProps = {
  nextButton?: string
  nextStep: () => void
}

const WelcomeActions: FunctionComponent<WelcomeActionsProps> = ({
  nextButton,
  nextStep,
}) => {
  const { translate } = useLocales()
  const welcomeNextButton = nextButton || translate('welcome.next_button')

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

  const actions = <WelcomeActions {...{ nextButton, nextStep }} />
  const welcomeTitle = title || translate('welcome.title')

  return (
    <ScreenLayout actions={actions} className={style.container}>
      <PageTitle title={welcomeTitle} />
      {forDocVideo ? (
        <DocVideoContent />
      ) : (
        <DefaultContent {...{ descriptions, translate }} />
      )}
    </ScreenLayout>
  )
}

export default trackComponent(Welcome)
