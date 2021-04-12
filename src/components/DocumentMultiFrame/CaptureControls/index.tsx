import { h, FunctionComponent } from 'preact'
import { memo, useEffect } from 'preact/compat'
import classNames from 'classnames'

import { useLocales } from '~locales'
import { DOC_MULTI_FRAME_CAPTURE } from '~utils/constants'
import CameraButton from '../../Button/CameraButton'
import style from './style.scss'

import type { VideoOverlayProps } from '../../VideoCapture'

const CaptureControls: FunctionComponent<VideoOverlayProps> = ({
  disableInteraction,
  isRecording,
  onStart,
  onStop,
}) => {
  const { translate } = useLocales()

  useEffect(() => {
    if (isRecording) {
      setTimeout(onStop, DOC_MULTI_FRAME_CAPTURE.VIDEO_LENGTH)
    }
  }, [isRecording, onStop])

  return (
    <div className={style.controls}>
      <CameraButton
        ariaLabel={translate('selfie_capture.button_accessibility')}
        disableInteraction={disableInteraction}
        onClick={onStart}
        className={classNames(style.shutter, {
          [style.disabled]: disableInteraction || isRecording,
        })}
      />
    </div>
  )
}

export default memo(CaptureControls)
