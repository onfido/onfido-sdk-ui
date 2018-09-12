import { h } from 'preact'
import classNames from 'classnames'
import {errors} from '../strings/errors'
import style from './style.css'
import { identity } from 'components/utils/func'
import { localised } from '../../locales'

const Error = ({className, error, translate, withArrow, renderMessage = identity, renderInstruction = identity}) => {
  const errorList = errors(translate)
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
    </div>
  )
}

export default localised(Error)
