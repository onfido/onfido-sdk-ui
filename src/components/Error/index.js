import { h, Component } from 'preact'
import {errors} from '../strings/errors'
import style from './style.css'

const Error = ({error}) => {
  const errorText = errors[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning';
  return (
    <div className={style[`container-${errorType}`]}>
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
