import CameraButton from 'components/Button/CameraButton'
import {
  CaptureProgress,
  Instructions,
  SuccessState,
} from 'components/DocumentVideo/reusables'
import { VideoOverlayProps } from 'components/VideoCapture'
import { FunctionComponent, h } from 'preact'
import { memo, useEffect } from 'preact/compat'
import { useLocales } from '~locales'
import { DocumentSides } from '~types/commons'
import { DOC_VIDEO_CAPTURE } from '~utils/constants'
import { MultiFrameCaptureStepActions } from './useMultiFrameCaptureStep'
import style from './CaptureControls.scss'

export type Props = {
  side: DocumentSides
  recordState: MultiFrameCaptureStepActions
  nextStep: () => void
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({
  onStart,
  onStop,
  side,
  recordState,
  nextStep,
}) => {
  const { translate } = useLocales()

  useEffect(() => {
    if (recordState === 'success') {
      onStop()
    }
  }, [recordState, onStop])

  switch (recordState) {
    default:
      return (
        <div className={style.controls}>
          <Instructions
            title={`Instructions ${
              side === 'front' ? 'front side' : 'back side'
            }`}
          />
          <CameraButton
            ariaLabel={'video_capture.button_accessibility'}
            onClick={() => {
              nextStep()
              onStart()
            }}
            className={style.btn}
            disableInteraction={false}
          />
        </div>
      )
    case 'scanning':
      return (
        <CaptureProgress
          duration={DOC_VIDEO_CAPTURE.HOLDING_STILL_TIMEOUT}
          title={'scanning document'}
        />
      )
    case 'success':
    case 'submit':
      return (
        <SuccessState
          ariaLabel={translate('doc_video_capture.success_accessibility')}
        />
      )
  }
}

export default memo(CaptureControls)
