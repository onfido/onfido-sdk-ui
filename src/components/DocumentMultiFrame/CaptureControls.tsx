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
import { DOC_MULTIFRAME_CAPTURE } from '~utils/constants'
import { MultiFrameCaptureStepActions } from './useMultiFrameCaptureStep'
import style from './CaptureControls.scss'
import theme from '../Theme/style.scss'

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
          <div className={style.instructions}>
            {side === 'back' && (
              <span className={`${theme.icon} ${style.icon}`} />
            )}
            <Instructions
              title={translate(`doc_multi_frame_capture.instruction_${side}`)}
            />
          </div>
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
          duration={DOC_MULTIFRAME_CAPTURE.SCANNING_TIMEOUT}
          title={translate(`doc_multi_frame_capture.scanning`)}
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
