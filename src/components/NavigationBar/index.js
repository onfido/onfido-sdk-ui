import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import {preventDefaultOnClick} from '../utils'
import { withFlowContext } from '../Flow'

const NavigationBar = ({prevStep, i18n, disabled, isFullScreen}) =>
  <div className={classNames(theme.navigationBar, style.navigation, {
    [style.fullScreenNav]: isFullScreen
  })}>
    <button href='#' className={classNames(style.back, {[style.disabled]: disabled})}
      onClick={preventDefaultOnClick(prevStep)}>
        <span className={style.iconBack} />
        <span className={style.label}>
          {i18n.t('back')}
        </span>
    </button>
 </div>

export default withFlowContext(NavigationBar)
