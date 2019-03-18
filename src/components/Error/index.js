import { h } from 'preact'
import classNames from 'classnames'
import errors from '../strings/errors'
import style from './style.css'
import { identity, noop } from 'components/utils/func'
import { localised } from '../../locales'

const Error = ({className, error, translate, withArrow, renderMessage = identity, renderInstruction = identity, isDismissible, onDismiss = noop}) => {
  const { message, instruction } = errors[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning'
  return (
    <div className={classNames(style[`container-${errorType}`], className)}>
      { withArrow && <div className={classNames(style.roundedTriangle, style[`${errorType}Triangle`])} /> }
      <div className={style.title}>
        <span className={style[`title-icon-${errorType}`]}/>
        <span className={style['title-text']}>{renderMessage(translate(message))}</span>
      </div>
      <p className={style.instruction}>
        <span className={style['instruction-text']}>
          {renderInstruction(translate(instruction))}
        </span>
      </p>
      { isDismissible && <span className={style.dismiss} onClick={onDismiss} /> }
    </div>
  )
}

export default localised(Error)
