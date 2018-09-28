// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import Timeout from '../Timeout'
import style from './style.css'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  hasError: boolean,
  onTimeout: void => void,
  onStart: void => void,
} & LocalisedType

const NotRecording = ({ translate, onStart, hasError, onTimeout }: Props) => (
  <div>
    { !hasError && <Timeout key="notRecording" seconds={ 12 } onTimeout={ onTimeout } /> }
    <div className={style.actions}>
      <div className={classNames(style.captureActionsHint, style.recordAction)}>
        { translate('capture.liveness.press_record') }
      </div>
      <button
        className={classNames(style.btn, style.startRecording)}
        onClick={onStart}
      />
    </div>
  </div>
)

export default localised(NotRecording)