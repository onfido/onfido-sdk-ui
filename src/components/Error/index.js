import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../../style/refactor.css'

const Error = ({visible}) => {
  return (
    <div
      className={theme['server-error'] + (visible ? '' : ' '+theme.hidden)}
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
