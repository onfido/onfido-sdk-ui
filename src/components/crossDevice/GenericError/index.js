import { h, Component } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'

class GenericError extends Component {
  render () {
    return (
      <div className={style.base}>
        <h1 className={`${theme.title} ${theme.center} ${style.title}`}>Something’s gone wrong</h1>
        <p className={`${theme.center} ${style.submessage}`}>You’ll need to restart your verification on your computer</p>
        <span className={`${theme.icon}  ${style.icon}`} />
      </div>
    )
  }
}

export default trackComponent(GenericError, 'generic_client_error')
