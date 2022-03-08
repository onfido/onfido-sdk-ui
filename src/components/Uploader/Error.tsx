import { h, Component } from 'preact'

import style from './style.scss'
import errors from '../strings/errors'
import { ErrorProp } from '~types/routers'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { lowerCase } from '~utils/string'
import { localised } from '~locales'
import { appendToTracking } from '../../Tracker'

type UploadErrorProps = {
  error: ErrorProp
} & WithTrackingProps &
  WithLocalisedProps

class UploadError extends Component<UploadErrorProps> {
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

export default appendToTracking(localised(UploadError))
