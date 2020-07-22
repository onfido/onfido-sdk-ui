import { h } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils/index'
import style from './style.scss'

const Button = ({
  className,
  sdkBtnClasses = [],
  disabled,
  children,
  onClick,
  ariaLive,
  ariaRelevant,
  ariaBusy
}) => (
  <button
    type="button"
    aria-live={ariaLive}
    aria-relevant={ariaRelevant}
    aria-busy={ariaBusy}
    disabled={disabled}
    onClick={onClick}
    className={classNames(
      className,
      style.button,
      ...sdkBtnClasses.map(c => style['button-' + c]),
      {
        [style.hoverDesktop]: isDesktop
      }
    )}
  >
    {children}
  </button>
)

export default Button
