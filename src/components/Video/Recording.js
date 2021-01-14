import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import Challenge /* , { type ChallengeType } */ from './Challenge'
import { localised /* , type LocalisedType */ } from '../../locales'
import style from './style.scss'
import theme from '../Theme/style.scss'

/* type Props = {
  currentChallenge: ChallengeType,
  isLastChallenge: boolean,
  hasError: boolean,
  disableInteraction: boolean,
  onNext: (void) => void,
  onStop: (void) => void,
} & LocalisedType */

const Recording = ({
  onStop,
  onNext,
  currentChallenge,
  isLastChallenge,
  disableInteraction,
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
        <Challenge {...{ ...currentChallenge }} />
      </div>
    </div>
    <div className={style.actions}>
      <div className={style.captureActionsHint}>
        {translate(
          isLastChallenge
            ? 'video_capture.body_stop'
            : 'video_capture.body_next'
        )}
      </div>
      {!isLastChallenge ? (
        <Button
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          disabled={disableInteraction}
          onClick={onNext}
          data-onfido-qa="liveness-next-challenge-btn"
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
