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
      {/* <InstructionsPure
        listScreenReaderText={translate('selfie_intro.list_accessibility')}
        instructions={instructions}
      /> */}
      <h3>{translate('auth_intro.instructions.oval')}</h3>
      <h3>{translate('auth_intro.instructions.eyes')}</h3>
      <div className={classNames(theme.thickWrapper, style.buttonContainer)}>
        <Button variant="primary" kind="action" onClick={nextStep}>
          {translate('auth_intro.button')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(
  //@ts-ignore
  compose(localised, withCrossDeviceWhenNoCamera)(Intro),
  'selfie_intro'
)
