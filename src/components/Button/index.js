import { h } from 'preact'
import classNames from 'classnames'
import style from './style.scss'
import { Button } from '@onfido/castor'

export default ({
  className,
  textClassName,
  variants = [],
  disabled,
  children,
  onClick,
  ariaLive,
  ariaRelevant,
  ariaBusy
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      ariaLive={ariaLive}
      ariaRelevant={ariaRelevant}
      ariaBusy={ariaBusy}
      className={classNames(
        className,
        ...variants.map(v => style['button-' + v])
      )}>
      <span className={classNames(textClassName, style['button-text'])}>
        {children}
      </span>
    </Button>
  )
}
