import { h, FunctionComponent, Fragment } from 'preact'
import { memo, useCallback, useEffect } from 'preact/compat'

import { useLocales } from '~locales'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import Button from '../Button'
import DocumentOverlay, {
  calculateHollowRect,
} from '../Overlay/DocumentOverlay'
import Instructions from './Instructions'
import StepProgress from './StepProgress'
import useCaptureStep from './useCaptureStep'
import style from './style.scss'

import type { CaptureFlows } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'
import type { VideoLayerProps } from '../VideoCapture'

export type Props = {
  captureFlow: CaptureFlows
  documentType: DocumentTypes
  flowRestartTrigger: number
  onSubmit: () => void
} & VideoLayerProps

const VISIBLE_BUTTON_TIMEOUT = 3000
const SUCCESS_STATE_TIMEOUT = 2000
const SUCCESS_STATE_VIBRATION = 500
const HOLDING_STILL_TIMEOUT = 6000

const VideoLayer: FunctionComponent<Props> = ({
  captureFlow,
  disableInteraction,
  documentType,
  flowRestartTrigger,
  isRecording,
  onStart,
  onStop,
  onSubmit,
}) => {
  const {
    captureStep,
    nextRecordState,
    nextStep,
    recordState,
    restart: restartFlow,
    stepNumber,
    totalSteps,
  } = useCaptureStep(captureFlow)

  const { [captureStep]: instructionKeys } = DOC_VIDEO_INSTRUCTIONS_MAPPING[
    captureFlow
  ]

  const { translate } = useLocales()

  /*
  useEffect(() => {
    console.log({ captureStep, recordState })
  }, [captureStep, recordState])
  */

  useEffect(() => {
    switch (recordState) {
      case 'hideButton':
        setTimeout(nextRecordState, VISIBLE_BUTTON_TIMEOUT)
        break

      case 'holdingStill':
        setTimeout(nextRecordState, HOLDING_STILL_TIMEOUT)
        break

      case 'success': {
        navigator.vibrate(SUCCESS_STATE_VIBRATION)

        if (stepNumber >= totalSteps) {
          onStop()
        }

        setTimeout(() => {
          if (stepNumber >= totalSteps) {
            onSubmit()
          } else {
            nextStep()
          }
        }, SUCCESS_STATE_TIMEOUT)

        break
      }

      default:
        break
    }
  }, [recordState]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    restartFlow()
  }, [flowRestartTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = useCallback(() => {
    nextStep()
    onStart()
  }, [nextStep, onStart])

  const { title, subtitle, button } = instructionKeys

  const instruction = (
    <Instructions
      subtitle={subtitle ? translate(subtitle) : undefined}
      title={translate(title)}
    />
  )

  const action = (
    <Button
      variants={['centered', 'primary', 'lg']}
      disabled={disableInteraction}
      onClick={isRecording ? nextRecordState : handleStart}
    >
      {translate(button)}
    </Button>
  )

  const renderItems = useCallback(() => {
    if (recordState === 'holdingStill') {
      return (
        <div className={style.holding}>
          <span />
        </div>
      )
    }

    if (recordState === 'success') {
      return (
        <div className={style.instructions}>
          <span className={style.success} />
        </div>
      )
    }

    return (
      <Fragment>
        {instruction}
        {recordState === 'showButton' ? (
          action
        ) : (
          <div className={style.buttonPlaceholder} />
        )}
      </Fragment>
    )
  }, [action, recordState, instruction])

  const hollowRect = calculateHollowRect(documentType, 0.5)

  return (
    <Fragment>
      <DocumentOverlay
        marginBottom={0.5}
        type={documentType}
        withPlaceholder={stepNumber === 0}
      />
      <div className={style.controls} style={{ top: hollowRect.bottom }}>
        <StepProgress stepNumber={stepNumber} totalSteps={totalSteps} />
        {renderItems()}
      </div>
    </Fragment>
  )
}

export default memo(VideoLayer)
