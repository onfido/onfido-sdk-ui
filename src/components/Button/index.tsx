import { h, FunctionComponent } from 'preact'
import { HTMLProps } from 'react'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import style from './style.scss'

type Props = HTMLProps<HTMLButtonElement> & {
  ariaBusy?: string
  ariaLive?: string
  ariaRelevant?: string
  onClick?: h.JSX.MouseEventHandler<HTMLButtonElement>
  textClassName?: string
  uiTestDataAttribute?: string
  variants?: string[]
}

const Button: FunctionComponent<Props> = ({
  ariaBusy,
  ariaLive,
  ariaRelevant,
  children,
  className,
  disabled,
  onClick,
  textClassName,
  uiTestDataAttribute,
  variants = [],
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
