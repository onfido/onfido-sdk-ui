import { h, FunctionComponent } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import { noop } from '~utils/func'
import { localised } from '~locales'
import style from './style.scss'
import theme from '../Theme/style.scss'

import type { WithLocalisedProps } from '~types/hocs'

export type RecordingProps = {
  children?: h.JSX.Element | h.JSX.Element[]
  disableInteraction?: boolean
  hasMoreSteps?: boolean
  onNext?: () => void
  onStop: () => void
}

type Props = RecordingProps & WithLocalisedProps

const Recording: FunctionComponent<Props> = ({
  children,
  disableInteraction = false,
  hasMoreSteps = false,
  onNext = noop,
  onStop,
  translate,
}) => (
  <div>
    <div className={style.caption}>{children}</div>
    <div className={style.actions}>
      {hasMoreSteps ? (
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          disabled={disableInteraction}
          onClick={onNext}
          data-onfido-qa="liveness-next-challenge-btn"
        >
          {translate('video_capture.button_primary_next')}
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          disabled={disableInteraction}
          onClick={onStop}
          data-onfido-qa="liveness-stop-recording-btn"
        >
          {translate('video_capture.button_primary_finish')}
        </Button>
      )}
    </div>
  </div>
)

export default localised(Recording)
