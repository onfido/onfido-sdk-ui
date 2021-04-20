import { FunctionComponent, h } from 'preact'
import PageTitle from '../PageTitle'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'
import { localised, useLocales } from '../../locales'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import { compose } from '~utils/func'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { StepComponentBaseProps } from '~types/routers'

const Intro: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const { translate } = useLocales()

  return (
    <div className={theme.fullHeightContainer}>
      <PageTitle
        title={translate('auth_intro.title')}
        subTitle={translate('auth_intro.subtitle')}
      />
      <div className={style.welcomeAuth} />
      <div>
        <p>{translate('auth_intro.line1')}</p>
        <p>{translate('auth_intro.line2')}</p>
      </div>
      <div className={classNames(theme.thickWrapper, style.buttonContainer)}>
        <Button
          variant="primary"
          kind="action"
          onClick={nextStep}
          className={classNames(theme['button-centered'], theme['button-lg'])}
        >
          {translate('auth_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(
  //@ts-ignore
  compose(localised, withCrossDeviceWhenNoCamera)(Intro)
)
