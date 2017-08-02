import { h, Component } from 'preact'
import {errors} from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'

const Error = ({error}) => {
  error = errors[error]
  if (error) return (
    <div className={style.container}>
      <p className={style.message}>
        <span className={style.icon}>{error.message}</span>
      </p>
      <p className={style.instruction}>
        {error.instruction}
      </p>
    </div>
  )
}

export default Error
