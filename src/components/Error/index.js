import { h } from 'preact'
import classNames from 'classnames'
import {errors} from '../strings/errors'
import style from './style.css'
import { identity } from 'components/utils/func'

const noop = () => {}

const Error = ({className, error, i18n, withArrow, renderMessage = identity, renderInstruction = identity, isDismissible, onDismiss = noop}) => {
  const errorList = errors(i18n)
  const errorText = errorList[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning'
  return (
    <div className={classNames(style[`container-${errorType}`], className)}>
      { withArrow && <div className={classNames(style.roundedTriangle, style[`${errorType}Triangle`])} /> }
      <div className={style.title}>
        <span className={style[`title-icon-${errorType}`]}/>
        <span className={style['title-text']}>{renderMessage(errorText.message)}</span>
      </div>
      <p className={style.instruction}>
        {renderInstruction(errorText.instruction)}
      </p>
      { isDismissible && <span className={style.dismiss} onClick={onDismiss} /> }
    </div>
  )
}

export default Error
