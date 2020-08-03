import { h } from 'preact'

import style from './style.scss'
import errors from '../strings/errors'

const UploadError = ({ error, translate }) => {
  const { message, instruction } = errors[error.name]
  return (
    <div className={style.error}>{`${translate(message)} ${translate(
      instruction
    )}`}</div>
  )
}

export default UploadError
