// @flow
import * as React from 'react'
import { h } from 'preact'
import Timeout from '../Timeout'
import Challenge from './Challenge'
import type { ChallengeType } from './Challenge'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'

type Props = {
  currentChallenge: ChallengeType,
  isLastChallenge: boolean,
  hasError: boolean,
  i18n: Object,
  onTimeout: void => void,
  onNext: void => void,
  onStop: void => void,
}

const Recording = ({ onTimeout, onStop, onNext, currentChallenge, isLastChallenge, hasError, i18n }: Props) => (
  <div>
    <Timeout key="recording" seconds={ 20 } onTimeout={ onTimeout } />
    <div className={style.caption}>
      <div>
        <div className={style.recordingIndicator}>
          {i18n.t('capture.liveness.recording')}
        </div>
        <Challenge {...{i18n, ...currentChallenge }} />
      </div>
    </div>
    <div className={style.actions}>
      <div className={style.captureActionsHint}>
        {i18n.t(`capture.liveness.challenges.done_${ isLastChallenge ? 'stop' : 'next' }`)}
      </div>
      {
        !isLastChallenge ?
          <button
            className={classNames(theme.btn, theme['btn-centered'], theme['btn-primary'])}
            onClick={onNext}>
            {i18n.t('capture.liveness.challenges.next')}
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

export default Recording
