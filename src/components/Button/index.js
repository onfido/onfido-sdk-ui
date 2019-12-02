import { h } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils/index'
import style from './style.css'
import withOnSubmitDisabling from './withOnSubmitDisabling'

const Button = ({ className, textClassName, variants = [], disabled, children, onBtnClick, ariaLive, ariaBusy }) =>
  <button
    type="button"
    aria-live={ariaLive}
    aria-busy={ariaBusy}
    disabled={disabled}
    onClick={onBtnClick}
    className={classNames(className, style.button, ...variants.map(v => style['button-' + v]), {
      [style.hoverDesktop]: isDesktop
    })}
  >
    <span className={classNames(textClassName, style['button-text'])}>
      {children}
    </span>
  </button>

export default withOnSubmitDisabling(Button)
