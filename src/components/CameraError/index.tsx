import { h, FunctionComponent } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '~utils'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'
import type { ErrorProp, RenderFallbackProp } from '~types/routers'
import {
  AnalyticsEventProperties,
  ErrorNameToUIAlertMapping,
} from '~types/tracker'
import { useCallback, useEffect, useState } from 'preact/hooks'

type Props = {
  error: ErrorProp
  hasBackdrop?: boolean
  isDismissible?: boolean
  renderFallback: RenderFallbackProp
} & WithTrackingProps

const CameraError: FunctionComponent<Props> = ({
  error,
  hasBackdrop,
  isDismissible,
  renderFallback,
  trackScreen,
}: Props) => {
  const [isDismissed, setIsDismissed] = useState(false)

  const trackFallbackClick = useCallback(() => {
    const { type, name } = error
    if (type === 'warning') {
      const uiAlertName = ErrorNameToUIAlertMapping[name]
      const properties: AnalyticsEventProperties = uiAlertName
        ? { ui_alerts: { [uiAlertName]: type } }
        : {}
      trackScreen('fallback_triggered', properties)
    }
  }, [error, trackScreen])

  useEffect(() => {
    setIsDismissed(false)
  }, [error.name])

  if (isDismissed) {
    return null
  }

  return (
    <div
      className={classNames(
        style.errorContainer,
        style[`${error.type}ContainerType`],
        {
          [style.errorHasBackdrop]: hasBackdrop,
        }
      )}
    >
      <Error
        role="alertdialog"
        className={style.errorMessage}
        error={error}
        trackScreen={trackScreen}
        focusOnMount={true}
        isDismissible={isDismissible}
        onDismiss={() => setIsDismissed(true)}
        renderInstruction={(str) =>
          parseTags(str, ({ text, type }) =>
            renderFallback({ text, type }, trackFallbackClick)
          )
        }
      />
    </div>
  )
}

export default CameraError
