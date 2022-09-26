import CameraButton from 'components/Button/CameraButton'
import {
  CaptureProgress,
  SuccessState,
} from 'components/DocumentVideo/reusables'
import { VideoOverlayProps } from 'components/VideoCapture'
import { FunctionComponent, h } from 'preact'
import { memo, useEffect } from 'preact/compat'
import { useLocales } from '~locales'
import { DOC_MULTIFRAME_CAPTURE } from '~utils/constants'
import { MultiFrameCaptureStepActions } from './useMultiFrameCaptureStep'
import style from './CaptureControls.scss'

export type Props = {
  recordState: MultiFrameCaptureStepActions
  nextStep: () => void
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({
  onStart,
  onStop,
  recordState,
  nextStep,
  disableInteraction,
}) => {
  const { translate } = useLocales()

  useEffect(() => {
    if (recordState === 'success') {
      onStop()
    }
  }, [recordState, onStop])

  switch (recordState) {
    case 'idle':
    case 'placeholder':
      return (
        <div className={style.controls}>
          <CameraButton
            ariaLabel={'video_capture.button_accessibility'}
            onClick={() => {
              nextStep()
              onStart()
            }}
            className={style.btn}
            disableInteraction={disableInteraction || recordState !== 'idle'}
          />
        </div>
      )
    case 'scanning':
      return (
        <CaptureProgress
          duration={DOC_MULTIFRAME_CAPTURE.SCANNING_TIMEOUT}
          title={translate(`doc_multi_frame_capture.capture_progress_title`)}
        />
      )
    case 'success':
    case 'submit':
      return (
        <SuccessState
          ariaLabel={translate('doc_multi_frame_capture.success_accessibility')}
        />
      )
  }
}

export default memo(CaptureControls)
