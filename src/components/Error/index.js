import { h, Component } from 'preact'
import classNames from 'classnames'
import errors from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'
import { identity, noop } from '~utils/func'
import { localised } from '../../locales'

class Error extends Component {
  componentDidMount() {
    if (this.props.focusOnMount && this.container) {
      this.container.focus()
    }
  }

  render() {
    const {
      role,
      className,
      error,
      translate,
      withArrow,
      renderMessage = identity,
      renderInstruction = identity,
      isDismissible,
      onDismiss = noop
    } = this.props
    const { message, instruction } = errors[error.name]
    const errorType = error.type === 'error' ? 'error' : 'warning'

    return (
      <div
        role={role}
        ref={node => this.container = node}
        tabIndex={-1}
        className={classNames(style[`container-${errorType}`], className)}
      >
        { withArrow && <div className={classNames(style.roundedTriangle, style[`${errorType}Triangle`])} /> }
        <div>
          <div className={style.title}>
            <span className={style[`title-icon-${errorType}`]}/>
            <span role="heading" className={style['title-text']}>{renderMessage(translate(message))}</span>
          </div>
          <p className={style.instruction}>
            <span className={style['instruction-text']}>{renderInstruction(translate(instruction))}</span>
          </p>
        </div>
        { isDismissible &&
            <button
              type="button"
              aria-label={translate('accessibility.dismiss_alert')}
              onClick={onDismiss}
              className={`${style.dismiss} ${theme[errorType]}`}
            /> }
      </div>
    )
  }
}

export default localised(Error)
