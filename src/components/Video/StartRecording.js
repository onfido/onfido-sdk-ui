// @flow
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.scss'
import { localised, type LocalisedType } from '../../locales'

type Props = {
  disableInteraction: boolean,
  onStart: (void) => void,
} & LocalisedType

const StartRecording = ({ translate, onStart, disableInteraction }: Props) => (
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
