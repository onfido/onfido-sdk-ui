import { h, Component } from 'preact'
import style from './style.css'

const Error = ({visible}) => {
  return (
    <div
      className={style.base + ' ' + (visible ? '' : style.hidden)}
    >
      <div>
        <p>There was an error connecting to the server</p>
        <p>Please wait and try again later</p>
      </div>
    </div>
  )
}

Error.defaultProps =  {
  visible: true
}

export default Error
