import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useState } from 'preact/compat'

import { useLocales } from '~locales'
import { DOC_MULTI_FRAME_CAPTURE } from '~utils/constants'
import { DOCUMENT_MULTI_FRAME_HEADER_MAPPING } from '~utils/localesMapping'
import CameraButton from '../../Button/CameraButton'
import {
  CaptureProgress,
  Instructions,
  SuccessState,
} from '../../DocumentVideo/reusables'
import style from './style.scss'

import type { DocumentSides } from '~types/commons'
import type { DocumentTypes } from '~types/steps'
import type { VideoOverlayProps } from '../../VideoCapture'

export type Props = {
  documentType: DocumentTypes
  onSubmit: () => void
  side: DocumentSides
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({
  disableInteraction,
  documentType,
  isRecording,
  onStart,
  onStop,
  onSubmit,
  side,
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

  const title = DOCUMENT_MULTI_FRAME_HEADER_MAPPING[documentType][side]

  return (
    <div className={style.controls}>
      <div>
        {!isSuccess && (
          <Instructions
            title={
              isRecording
                ? translate('doc_capture.header.progress')
                : translate(title)
            }
          />
        )}
        {isRecording && (
          <CaptureProgress
            duration={DOC_MULTI_FRAME_CAPTURE.CAPTURE_DURATION}
          />
        )}
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
