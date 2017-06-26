import { h, Component } from 'preact'
import {errors} from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'

const ApiUploadError = ({error}) => {
  error = errors[error]
  if (error) return (
    <div className={style.error}>
      <p className={style.errorMessage}>
        <span className={style.icon}/>
        {error}
      </p>
    </div>
  )
}

export default ApiUploadError
