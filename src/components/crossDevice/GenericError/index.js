import { h, Component } from 'preact'

import Title from '../../Title'
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
        <Title title="Something's gone wrong" subTitle="You’ll need to restart your verification on your computer" />
        <div className={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
        </div>
      </div>
    )
  }
}

export default GenericError
