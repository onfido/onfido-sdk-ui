import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { trackComponent } from '../../Tracker'
import { Button } from '@onfido/castor-react'
import theme from '../../components/Theme/style.scss'
import ScreenLayout from '../../components/Theme/ScreenLayout'
import PageTitle from '../../components/PageTitle'
import style from './style.scss'
import { WithTrackingProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'

type RetryTextConfigProps = {
  headline?: string
  description?: string
  button_title?: string
}

type RetryProps = StepComponentBaseProps & {
  text?: RetryTextConfigProps
} & WithTrackingProps

const Retry: FunctionComponent<RetryProps> = ({ text, nextStep }) => {
  const actions = (
    <Button
      type="button"
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      onClick={nextStep}
      data-onfido-qa="retry-btn"
    >
      {text?.button_title}
    </Button>
  )

  return (
    <ScreenLayout
      actions={actions}
      className={style.container}
      pageId={'Retry'}
    >
      <PageTitle
        title={text?.headline || ''}
        subTitle={text?.description}
        shouldAutoFocus={true}
      />
    </ScreenLayout>
  )
}

export default trackComponent(Retry)
