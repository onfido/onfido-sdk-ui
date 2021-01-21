import { h, Component } from 'preact'
import classNames from 'classnames'

import { identity, noop } from '~utils/func'
import errors from '../strings/errors'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'
import type { ParsedElement } from '~types/locales'
import type { ErrorProp } from '~types/routers'

type ErrorRoles = 'alert' | 'alertdialog'

type ErrorProps = {
  className?: string
  error: ErrorProp
  focusOnMount?: boolean
  isDismissible?: boolean
  onDismiss?: () => void
  renderInstruction?: (str: string) => ParsedElement[]
  renderMessage?: () => h.JSX.Element
  role: ErrorRoles
  withArrow?: boolean
}

type Props = ErrorProps & WithLocalisedProps

class Error extends Component<Props> {
  private container?: HTMLDivElement = null

  componentDidMount() {
    if (this.props.focusOnMount && this.container) {
      this.container.focus()
    }
  }

  render() {
    const {
      className,
      error,
      isDismissible,
      onDismiss = noop,
      renderInstruction = identity,
      renderMessage = identity,
      role,
      translate,
      withArrow,
    } = this.props
    const { message, instruction } = errors[error.name]
    const errorType = error.type === 'error' ? 'error' : 'warning'

    return (
      <div
        role={role}
        aria-modal={role && role.includes('dialog')}
        ref={(node) => (this.container = node)}
        tabIndex={-1}
        className={classNames(
          style.container,
          style[`container-${errorType}`],
          className
        )}
      >
        {withArrow && (
          <div
            className={classNames(
              style.roundedTriangle,
              style[`${errorType}Triangle`]
            )}
          />
        )}
        <div>
          <div className={style.title}>
            <span
              className={classNames(
                style['title-icon'],
                style[`title-icon-${errorType}`]
              )}
            />
            <span role="heading" aria-level="1" className={style['title-text']}>
              {renderMessage(translate(message))}
            </span>
          </div>
          <p className={style.instruction}>
            <span className={style['instruction-text']}>
              {renderInstruction(translate(instruction))}
            </span>
          </p>
        </div>
        {isDismissible && (
          <button
            type="button"
            aria-label={translate('generic.accessibility.dismiss_alert')}
            onClick={onDismiss}
            className={`${style.dismiss} ${theme[errorType]}`}
          />
        )}
      </div>
    )
  }
}

export default localised(Error)
