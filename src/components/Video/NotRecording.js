// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import Timeout from '../Timeout'
import style from './style.css'

type Props = {
  hasError: boolean,
  i18n: Object,
  onTimeout: void => void,
  onStart: void => void,
}

const NotRecording = ({ i18n, onStart, hasError, onTimeout }: Props) => (
  <div>
    { !hasError && <Timeout key="notRecording" seconds={ 12 } onTimeout={ onTimeout } /> }
    <div className={style.actions}>
      <div className={classNames(style.captureActionsHint, style.recordAction)}>
        { i18n.t('capture.liveness.press_record') }
      </div>
      <button
        className={classNames(style.btn, style.startRecording)}
        onClick={onStart}
        disabled={hasError}
      />
    </div>
  </div>
)

export default NotRecording