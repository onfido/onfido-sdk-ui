import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'
import {localised} from '../../locales'

const NavigationBar = ({back, translate, disabled, isFullScreen, className}) =>
  <div className={classNames(className, style.navigation, {
    [style.fullScreenNav]: isFullScreen
  })}>
    <button href='#' className={classNames(style.back, {[style.disabled]: disabled})}
      onClick={preventDefaultOnClick(back)}>
        <span className={style.iconBack} />
        <span className={style.label}>
          {translate('back')}
        </span>
    </button>
 </div>

export default localised(NavigationBar)
