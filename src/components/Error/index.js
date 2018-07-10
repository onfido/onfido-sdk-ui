import { h } from 'preact'
import classNames from 'classnames'
import {errors} from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'
import { identity } from 'components/utils/func'

const Error = ({className, error, i18n, smaller, renderMessage = identity, renderInstruction = identity, renderAction}) => {
  const errorList = errors(i18n)
  const errorText = errorList[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning'
  return (
    <div className={classNames(style[`container-${errorType}`], {
      [style.smaller]: smaller,
    }, className)}>
      <div className={style.title}>
        <span className={style[`title-icon-${errorType}`]}/>
        <span className={style['title-text']}>{renderMessage(errorText.message)}</span>
      </div>
      <p className={style.instruction}>
        {renderInstruction(errorText.instruction)}
      </p>
      {
        renderAction ?
          <div className={theme.actions}>
          {renderAction()}
          </div> :
          null
      }
    </div>
  )
}

export default Error
 