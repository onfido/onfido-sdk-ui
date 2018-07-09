import { h } from 'preact'
import classNames from 'classnames'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const Intro = ({i18n, nextStep, crossDeviceInitialStepType}) => {
  const isFace = crossDeviceInitialStepType === 'face'
  const steps = {
    'sms': 'sms',
    'take-photos': `${ isFace ? 'face' : 'document' }.take_photos`,
    'return-computer': 'return_computer',
  }
  return (
    <div className={theme.fullHeightMobileContainer}>
      <Title
        title={i18n.t(`cross_device.intro.${ isFace ? 'face' : 'document' }.title`)}
        subTitle={i18n.t('cross_device.intro.sub_title')}
      />
      <div className={classNames(theme.thickWrapper, style.content)}>
      {
        Object.keys(steps).map(key =>
          <div key={key} className={style.step}>
            <div className={classNames(style.stepIcon, style[`stepIcon-${key}`])}></div>
            <div className={style.stepMessage}>
              {i18n.t(`cross_device.intro.${steps[key]}`)}
            </div>
          </div>
        )  
      }
      </div>
      <div className={theme.thickWrapper}>
        <button
          className={`${theme.btn} ${theme["btn-primary"]} ${theme["btn-centered"]}`}
          onClick={preventDefaultOnClick(nextStep)}
        >
        {i18n.t('cross_device.intro.lets_start')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(Intro)
