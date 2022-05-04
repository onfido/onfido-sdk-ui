import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import theme from 'components/Theme/style.scss'
import { trackComponent } from '../../../Tracker'
import PageTitle from '../../PageTitle'
import ScreenLayout from '../../Theme/ScreenLayout'

import style from './style.scss'
import type { StepComponentDataProps } from '~types/routers'

type RetryTextOtionsProps = {
  headline: string
  description: string
  button_title: string
}

type RetryTextConfigProps = {
  text: RetryTextOtionsProps
}

type RetryProps = StepComponentDataProps & {
  data: RetryTextConfigProps
  nextStep: () => void
}

const Retry = ({ data, nextStep }: RetryProps) => {
  const { text } = data
  const actions = (
    <Button
      type="button"
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      onClick={nextStep}
      data-onfido-qa="retry-btn"
    >
      {text.button_title}
    </Button>
  )

  return (
    <ScreenLayout
      actions={actions}
      className={style.container}
      pageId={'Retry'}
    >
      <PageTitle title={text.headline} subTitle={text.description} />
    </ScreenLayout>
  )
}

export default trackComponent(Retry)
