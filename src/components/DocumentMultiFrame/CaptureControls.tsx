import CameraButton from 'components/Button/CameraButton'
import {
  CaptureProgress,
  SuccessState,
} from 'components/DocumentVideo/reusables'
import { VideoOverlayProps } from 'components/VideoCapture'
import { Fragment, FunctionComponent, h } from 'preact'
import { memo, useEffect } from 'preact/compat'
import { useLocales } from '~locales'
import type { CaptureSteps } from '~types/docVideo'
import { DOC_VIDEO_CAPTURE } from '~utils/constants'
import useMultiFrameCapture from './useMultiFrameCaptureStep'

export type Props = {
  onStepChange?: (step: CaptureSteps) => void
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({ onStart, onStop }) => {
  const { nextRecordState, nextStep, recordState } = useMultiFrameCapture()
  const { translate } = useLocales()

  useEffect(() => {
    switch (recordState) {
      case 'scanning':
        setTimeout(nextRecordState, 1500)
        break
      case 'success':
        navigator.vibrate && navigator.vibrate(500)
        setTimeout(onStop, 1500)
        break
    }
  }, [recordState, nextRecordState, onStop])

  return (
    <Fragment>
      {recordState === 'idle' ? (
        <Fragment>
          <div>Instructions</div>
          <CameraButton
            ariaLabel={'video_capture.button_accessibility'}
            onClick={() => {
              onStart()
              nextStep()
            }}
            className={''}
            disableInteraction={false}
          />
        </Fragment>
      ) : undefined}
      {recordState === 'scanning' ? (
        <CaptureProgress
          duration={DOC_VIDEO_CAPTURE.HOLDING_STILL_TIMEOUT}
          title={'scanning document'}
        />
      ) : undefined}
      {recordState === 'success' ? (
        <SuccessState
          ariaLabel={translate('doc_video_capture.success_accessibility')}
        />
      ) : undefined}
    </Fragment>
  )
}

export default memo(CaptureControls)
