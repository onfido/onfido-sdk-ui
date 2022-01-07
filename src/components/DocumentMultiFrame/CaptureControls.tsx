import CameraButton from 'components/Button/CameraButton'
import {
  CaptureProgress,
  SuccessState,
} from 'components/DocumentVideo/reusables'
import { VideoOverlayProps } from 'components/VideoCapture'
import { Fragment, FunctionComponent, h } from 'preact'
import { memo, useEffect } from 'preact/compat'
import { useLocales } from '~locales'
import { DocumentSides } from '~types/commons'
import { DOC_VIDEO_CAPTURE } from '~utils/constants'
import { MultiFrameCaptureStepActions } from './useMultiFrameCaptureStep'

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
        <Fragment>
          <div>
            Instructions {side === 'front' ? 'front side' : 'back side'}
          </div>
          <CameraButton
            ariaLabel={'video_capture.button_accessibility'}
            onClick={() => {
              nextStep()
              onStart()
            }}
            className={''}
            disableInteraction={false}
          />
        </Fragment>
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
