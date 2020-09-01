import { h } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils/index'
import style from './style.scss'

const Button = ({
  uiTestDataAttribute,
  className,
  textClassName,
  variants = [],
  disabled,
  children,
  onClick,
  ariaLive,
  ariaRelevant,
  ariaBusy,
}) => (
  <button
    type="button"
    aria-live={ariaLive}
    aria-relevant={ariaRelevant}
    aria-busy={ariaBusy}
    disabled={disabled}
    onClick={onClick}
    data-onfido-qa={uiTestDataAttribute}
    className={classNames(
      className,
      style.button,
      ...variants.map((v) => style[`button-${v}`]),
      {
        [style.hoverDesktop]: isDesktop,
      }
    )}
  >
    <span className={classNames(textClassName, style['button-text'])}>
      {children}
    </span>
  </button>
)

export default Button
