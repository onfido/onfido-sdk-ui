import { h, Component } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import { sendScreen } from '../../../Tracker'

class GenericError extends Component {
  componentDidMount() {
    sendScreen(['generic_client_error'])
  }
  render () {
    return (
      <div>
        <h1 className={theme.title}>Something’s gone wrong</h1>
        <div className={theme.thickWrapper}>
          <p className={`${theme.center} ${style.submessage}`}>You’ll need to restart your verification on your computer</p>
          <span className={`${theme.icon}  ${style.icon}`} />
        </div>
      </div>
    )
  }
}

export default GenericError
