import { h, Component } from 'preact'

import style from './style.scss'
import errors from '../strings/errors'
import { ErrorProp } from '~types/routers'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { lowerCase } from '~utils/string'

type UploadErrorProps = {
  error: ErrorProp
}

type Props = UploadErrorProps & WithTrackingProps & WithLocalisedProps

class UploadError extends Component<Props> {
  componentDidMount() {
    this.props.trackScreen(lowerCase(this.props.error.name))
  }

  render() {
    const { error, translate } = this.props
    const { message, instruction } = errors[error.name]

    return (
      <div className={style.error}>
        {`${translate(message)} ${translate(instruction)}`}
      </div>
    )
  }
}

export default UploadError
