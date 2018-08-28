import { h, Component } from 'preact'

import Title from '../../Title'
import theme from '../../Theme/style.css'
import style from './style.css'
import { sendScreen } from '../../../Tracker'
import { localised } from '../../../locales'

class GenericError extends Component {
  componentDidMount() {
    sendScreen(['generic_client_error'])
  }
  render ({t}) {
    return (
      <div>
        <Title title={t('errors.generic_client_error.message')} subTitle={t('errors.generic_client_error.instruction')} />
        <div className={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
        </div>
      </div>
    )
  }
}

export default localised(GenericError)
