import { h, Component } from 'preact'
import classNames from 'classnames'

import { identity, noop } from '~utils/func'
import { lowerCase } from '~utils/string'
import errors from '../strings/errors'
import { localised } from '~locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { ParsedElement } from '~types/locales'
import type { ErrorProp } from '~types/routers'
import {
  isDocumentTrackingError,
  trackDocumentError,
} from 'Tracker/errorTracking'

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

type Props = ErrorProps & WithLocalisedProps & WithTrackingProps

class Error extends Component<Props> {
  private container?: HTMLDivElement

  componentDidMount() {
    if (this.props.focusOnMount && this.container) {
      this.container.focus()
    }

    if (isDocumentTrackingError(this.props.error.name)) {
      trackDocumentError(this.props.error, this.props.trackScreen)
    } else {
      this.props.trackScreen(
        lowerCase(this.props.error.name),
        this.props.error.properties
      )
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
    const { message, instruction } =
      errors[error.name] || errors['REQUEST_ERROR']
    const errorType = error.type === 'error' ? 'error' : 'warning'

    return (
      <div
        role={role}
        aria-modal={role && role.includes('dialog')}
        ref={(node) => node && (this.container = node)}
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
