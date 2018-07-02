import { h } from 'preact'
import classNames from 'classnames'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const Intro = ({i18n, nextStep}) => {
  return (
    <div className={classNames(theme.fullHeightContainer, style.container)}>
      <Title
        title={i18n.t('cross_device.intro.title')}
        subTitle={i18n.t('cross_device.intro.sub_title')}
      />
      <div className={classNames(theme.thickWrapper, style.content)}>
      {
        ['sms', 'take_photos', 'return_computer'].map(step =>
          <div key={step} className={style.step}>
            <div className={classNames(style.stepIcon, style[`stepIcon-${step}`])}></div>
            <div className={style.stepMessage}>
              {i18n.t(`cross_device.intro.${step}`)}
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
