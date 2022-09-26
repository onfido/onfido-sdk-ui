import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { localised } from '~locales'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'

type StartRecordingProps = {
  disableInteraction: boolean
  onStart: () => void
}

type Props = StartRecordingProps & WithLocalisedProps

const StartRecording: FunctionComponent<Props> = ({
  disableInteraction,
  onStart,
  translate,
}) => (
  <div className={style.actions}>
    <div className={classNames(style.captureActionsHint, style.recordAction)}>
      {translate('video_capture.body_record')}
    </div>
    <button
      type="button"
      aria-label={translate('video_capture.button_record_accessibility')}
      disabled={disableInteraction}
      onClick={onStart}
      className={classNames(style.btn, style.startRecording)}
    />
  </div>
)

export default localised(StartRecording)
