// @flow
import * as React from 'react'
import { h } from 'preact'
import Timeout from '../Timeout'
import Challenge from './Challenge'
import type { ChallengeType } from './Challenge'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  currentChallenge: ChallengeType,
  isLastChallenge: boolean,
  hasError: boolean,
  onTimeout: void => void,
  onNext: void => void,
  onStop: void => void,
} & LocalisedType

const Recording = ({ onTimeout, onStop, onNext, currentChallenge, isLastChallenge, hasError, translate }: Props) => (
  <div>
    { !hasError && <Timeout key="recording" seconds={ 20 } onTimeout={ onTimeout } /> }
    <div className={style.caption}>
      <div>
        <div className={style.recordingIndicator}>
          <span className={style.recordingIndicatorText}>
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
          <button
            className={classNames(theme.btn, theme['btn-centered'], theme['btn-primary'])}
            onClick={onNext}>
            {translate('capture.liveness.challenges.next')}
          </button> :
          <button
            className={classNames(style.btn, style.stopRecording)}
            onClick={onStop}
            disabled={hasError}
          />
      }
    </div>
  </div>
)

export default localised(Recording)
