import { h, Component } from 'preact'
import PageTitle from '../PageTitle'
import errors from '../strings/errors'
import { lowerCase } from '~utils/string'
import { sendScreen } from '../../Tracker'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

class GenericError extends Component {
  componentDidMount() {
    sendScreen([`${lowerCase(this.props.error.name)}`])
  }
  render({ translate, error }) {
    const { message, instruction, icon } = errors[error.name]
    const iconName = icon ? icon : 'genericErrorIcon'
    return (
      <div>
        <PageTitle
          title={translate(message)}
          subTitle={translate(instruction)}
        />
        <div className={theme.thickWrapper}>
          <span className={`${theme.icon} ${style[iconName]}`} />
        </div>
      </div>
    )
  }
}

export default localised(GenericError)
