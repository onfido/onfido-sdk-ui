import { h, Component } from 'preact'

import Title from '../../Title'
import theme from '../../Theme/style.css'
import style from './style.css'
import { sendScreen } from '../../../Tracker'

class GenericError extends Component {
  componentDidMount() {
    sendScreen(['generic_client_error'])
  }
  render ({i18n}) {
    return (
      <div>
        <Title title={i18n.t('errors.generic_client_error.message')} subTitle={i18n.t('errors.generic_client_error.instruction')} />
        <div className={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
        </div>
      </div>
    )
  }
}

export default GenericError
