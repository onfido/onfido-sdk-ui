import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import { useLocales } from '~locales'
import theme from 'components/Theme/style.scss'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'

import type { StepComponentBaseProps } from '~types/routers'
import PageTitle from 'components/PageTitle'

type MsvcErrorType = 'GENERAL' | 'RESTART' | 'UNVERIFIABLE'

const titleKey = (key: MsvcErrorType): string => {
  switch (key) {
    case 'UNVERIFIABLE':
      return 'unverifiable'

    case 'RESTART':
      return 'restart'
  }

  return 'general'
}

type MsvcErrorActionsProps = {
  nextStep: () => void
}

const MsvcErrorActions: FunctionComponent<MsvcErrorActionsProps> = ({
  nextStep,
}) => {
  const { translate } = useLocales()

  const buttonLabel = translate('msvc_error.start_again_button')

  return (
    <div className={theme.contentMargin}>
      <Button
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={nextStep}
        data-onfido-qa="msvc-error-btn"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

type MsvcErrorProps = {
  errorType: 'GENERAL' | 'RESTART' | 'UNVERIFIABLE'
}

const MsvcError: FunctionComponent<MsvcErrorProps & StepComponentBaseProps> = ({
  errorType = 'GENERAL',
  nextStep,
}) => {
  const canRestart = ['RESTART', 'UNVERIFIABLE'].includes(errorType)
  const { translate } = useLocales()

  const actions = canRestart ? (
    <MsvcErrorActions {...{ nextStep }} />
  ) : undefined

  return (
    <ScreenLayout actions={actions} className={style.container}>
      <div>
        <span className={`${theme.icon} ${style['msvcErrorIcon']}`} />
      </div>
      <PageTitle
        title={translate(`msvc_error.${titleKey(errorType)}.title`)}
        subTitle={translate(`msvc_error.${titleKey(errorType)}.subTitle`)}
      />
    </ScreenLayout>
  )
}

export default MsvcError
