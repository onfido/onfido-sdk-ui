import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { noop } from '~utils/func'
import { localised } from '../../locales'
import Button from '../Button'
import style from './style.scss'

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
    <div className={style.caption}>
      <div>
        <div className={style.recordingIndicator}>
          <span role="status" className={style.recordingIndicatorText}>
            {translate('video_capture.status')}
          </span>
        </div>
        {children}
      </div>
    </div>
    <div className={style.actions}>
      <div className={style.captureActionsHint}>
        {translate(
          hasMoreSteps ? 'video_capture.body_next' : 'video_capture.body_stop'
        )}
      </div>
      {hasMoreSteps ? (
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={onNext}
        >
          {translate('video_capture.button_primary_next')}
        </Button>
      ) : (
        <button
          type="button"
          aria-label={translate('video_capture.button_stop_accessibility')}
          disabled={disableInteraction}
          onClick={onStop}
          className={classNames(style.btn, style.stopRecording)}
        />
      )}
    </div>
  </div>
)

export default localised(Recording)
