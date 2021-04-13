import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useState } from 'preact/compat'

import { useLocales } from '~locales'
import { DOC_MULTI_FRAME_CAPTURE } from '~utils/constants'
import CameraButton from '../../Button/CameraButton'
import {
  CaptureProgress,
  Instructions,
  SuccessState,
} from '../../DocumentVideo/reusables'
import style from './style.scss'

import type { VideoOverlayProps } from '../../VideoCapture'

type Props = {
  onSubmit: () => void
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({
  disableInteraction,
  isRecording,
  onStart,
  onStop,
  onSubmit,
}) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { translate } = useLocales()

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setIsSuccess(true)
        onStop()
      }, DOC_MULTI_FRAME_CAPTURE.CAPTURE_DURATION)
    }
  }, [isRecording]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSuccess) {
      setTimeout(onSubmit, DOC_MULTI_FRAME_CAPTURE.SUCCESS_STATE_TIMEOUT)
    }
  }, [isSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={style.controls}>
      <div>
        {!isSuccess && (
          <Instructions
            title={
              isRecording
                ? translate('doc_capture.header.progress')
                : 'Front of driver’s license'
            }
          />
        )}
        {isRecording && <CaptureProgress />}
        {isSuccess && <SuccessState ariaLabel="Success" />}
      </div>
      {!disableInteraction && !isRecording && !isSuccess && (
        <CameraButton
          ariaLabel={translate('selfie_capture.button_accessibility')}
          disableInteraction={disableInteraction}
          onClick={onStart}
          className={style.shutter}
        />
      )}
    </div>
  )
}

export default memo(CaptureControls)
