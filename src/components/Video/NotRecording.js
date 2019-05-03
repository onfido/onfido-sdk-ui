// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import Timeout from '../Timeout'
import style from './style.css'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  hasTimeoutError: boolean,
  hasCameraError: boolean,
  onTimeout: void => void,
  onStart: void => void,
} & LocalisedType

const NotRecording = ({ translate, onStart, hasTimeoutError, hasCameraError, onTimeout }: Props) => (
  <div>
    { !hasTimeoutError && !hasCameraError ? <Timeout key="notRecording" seconds={ 12 } onTimeout={ onTimeout } /> : null }
    <div className={style.actions}>
      <div className={classNames(style.captureActionsHint, style.recordAction)}>
        { translate('capture.liveness.press_record') }
      </div>
      <button
        aria-label={translate('accessibility.start_recording')}
        className={classNames(style.btn, style.startRecording)}
        disabled={hasCameraError}
        onClick={onStart}
      />
    </div>
  </div>
)

export default localised(NotRecording)
