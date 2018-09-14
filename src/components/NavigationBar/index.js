import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'

const NavigationBar = ({back, i18n, disabled, isFullScreen, className}) =>
  <div className={classNames(className, style.navigation, {
    [style.fullScreenNav]: isFullScreen
  })}>
    <button href='#' className={classNames(style.back, {[style.disabled]: disabled})}
      onClick={preventDefaultOnClick(back)}>
        <span className={style.iconBack} />
        <span className={style.label}>
          {i18n.t('back')}
        </span>
    </button>
 </div>

export default NavigationBar
