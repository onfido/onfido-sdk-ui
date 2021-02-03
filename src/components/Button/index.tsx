import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils/index'
import style from './style.scss'

type ButtonProps = {
  uiTestDataAttribute?: string
  className?: string
  textClassName?: string
  variants: Array<string>
  disabled?: boolean
  onClick: h.JSX.MouseEventHandler<HTMLButtonElement>
  ariaLive?: string
  ariaRelevant?: string
  ariaBusy?: string
}

const Button: FunctionComponent<ButtonProps> = ({
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
