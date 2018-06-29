import { h } from 'preact'
import classNames from 'classnames'
import {errors} from '../strings/errors'
import style from './style.css'

const Error = ({className, error, i18n, options, smaller}) => {
  const errorList = errors(i18n, options)
  const errorText = errorList[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning'
  return (
    <div className={classNames(style[`container-${errorType}`], {
      [style.smaller]: smaller,
    }, className)}>
      <div className={style.title}>
        <span className={style[`title-icon-${errorType}`]}/>
        <span className={style['title-text']}>{errorText.message}</span>
      </div>
      <p className={style.instruction}>
        {errorText.instruction}
      </p>
    </div>
  )
}

export default Error
