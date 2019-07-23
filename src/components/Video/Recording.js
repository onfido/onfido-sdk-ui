// @flow
import * as React from 'react'
import { h } from 'preact'
import Timeout from '../Timeout'
import Challenge from './Challenge'
import type { ChallengeType } from './Challenge'
import classNames from 'classnames'
import Button from '../Button'
import style from './style.css'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  currentChallenge: ChallengeType,
  isLastChallenge: boolean,
  hasError: boolean,
  disableInteraction: boolean,
  onTimeout: void => void,
  onNext: void => void,
  onStop: void => void,
} & LocalisedType

const Recording = ({ onTimeout, onStop, onNext, currentChallenge, isLastChallenge, hasError, disableInteraction, translate }: Props) => (
  <div>
    { !hasError && <Timeout key="recording" seconds={ 20 } onTimeout={ onTimeout } /> }
    <div className={style.caption}>
      <div>
        <div className={style.recordingIndicator}>
          <span role="status" className={style.recordingIndicatorText}>
            {translate('capture.liveness.recording')}
          </span>
        </div>
        <Challenge {...{...currentChallenge}} />
      </div>
    </div>
    <div className={style.actions}>
      <div className={style.captureActionsHint}>
        {translate(`capture.liveness.challenges.done_${ isLastChallenge ? 'stop' : 'next' }`)}
      </div>
      {
        !isLastChallenge ?
          <Button
            variants={['centered', 'primary']}
            disabled={disableInteraction}
            onClick={onNext}
          >
            {translate('capture.liveness.challenges.next')}
          </Button> :
          <button
            type="button"
            aria-label={translate('accessibility.stop_recording')}
            disabled={disableInteraction}
            onClick={onStop}
            className={classNames(style.btn, style.stopRecording)}
          />
      }
    </div>
  </div>
)

export default localised(Recording)
