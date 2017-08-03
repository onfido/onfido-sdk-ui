import { h, Component } from 'preact'
import classNames from 'classnames'
import {errors} from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'


const Error = ({error}) => {
  const errorText = errors[error.name]
  const errorStyle = error.type === 'error' ? style.error : style.warning
  const icon = error.type === 'error' ? style.errorIcon : style.warningIcon
  return (
    <div className={classNames(errorStyle, style.container)}>
      <p className={style.message}>
        <span className={icon}>{errorText.message}</span>
      </p>
      <p className={style.instruction}>
        {errorText.instruction}
      </p>
    </div>
  )
}

export default Error
