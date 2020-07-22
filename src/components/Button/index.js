import { h } from 'preact'
import classNames from 'classnames'
import style from './style.scss'
import { Button } from '@onfido/castor'

export default ({
  className,
  variant = 'primary',
  sdkBtnClasses = [],
  disabled,
  children,
  onClick,
  ariaLive,
  ariaRelevant,
  ariaBusy
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      ariaLive={ariaLive}
      ariaRelevant={ariaRelevant}
      ariaBusy={ariaBusy}
      className={classNames(
        className,
        ...sdkBtnClasses.map(v => style['button-' + v])
      )}>
      {children}
    </Button>
  )
}
