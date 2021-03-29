import { h, FunctionComponent, Fragment } from 'preact'
import { memo, useCallback, useEffect } from 'preact/compat'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import { useLocales } from '~locales'
import { DOC_VIDEO_CAPTURE } from '~utils/constants'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import theme from 'components/Theme/style.scss'
import Instructions from './Instructions'
import StepProgress from './StepProgress'
import useCaptureStep from './useCaptureStep'
import style from './style.scss'

import type { CaptureFlows, CaptureSteps } from '~types/docVideo'
import type { VideoOverlayProps } from '../../VideoCapture'

export type Props = {
  captureFlow: CaptureFlows
  flowRestartTrigger: number
  onStepChange?: (step: CaptureSteps) => void
  onSubmit: () => void
} & VideoOverlayProps

const CaptureControls: FunctionComponent<Props> = ({
  captureFlow,
  disableInteraction,
  flowRestartTrigger,
  isRecording,
  onStart,
  onStepChange,
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

  useEffect(() => {
    onStepChange && onStepChange(captureStep)
  }, [onStepChange, captureStep])

  useEffect(() => {
    switch (recordState) {
      case 'hideButton':
        setTimeout(nextRecordState, DOC_VIDEO_CAPTURE.BUTTON_VISIBILITY_TIMEOUT)
        break

      case 'holdStill':
        setTimeout(nextRecordState, DOC_VIDEO_CAPTURE.HOLDING_STILL_TIMEOUT)
        break

      case 'success': {
        navigator.vibrate &&
          navigator.vibrate(DOC_VIDEO_CAPTURE.SUCCESS_STATE_VIBRATION)

        if (stepNumber >= totalSteps) {
          onStop()
        }

        setTimeout(() => {
          if (stepNumber >= totalSteps) {
            onSubmit()
          } else {
            nextStep()
          }
        }, DOC_VIDEO_CAPTURE.SUCCESS_STATE_TIMEOUT)

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
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      disabled={disableInteraction}
      onClick={isRecording ? nextRecordState : handleStart}
      data-onfido-qa="doc-video-capture-btn"
    >
      {translate(button)}
    </Button>
  )

  const renderItems = useCallback(() => {
    if (recordState === 'holdStill') {
      return (
        <div className={style.holdStill}>
          <span className={style.text}>
            {translate('doc_video_capture.header_passport_progress')}
          </span>
          <span className={style.loading}>
            <span className={style.active} />
            <span className={style.background} />
          </span>
        </div>
      )
    }

    if (recordState === 'success') {
      const ariaLabel = translate('doc_video_capture.success_accessibility')

      return (
        <div className={style.instructions}>
          <span className={style.success} />
          <span className={style.successAria} aria-label={ariaLabel}>
            {ariaLabel}
          </span>
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
  }, [action, recordState, instruction, translate])

  return (
    <div className={style.controls}>
      <StepProgress stepNumber={stepNumber} totalSteps={totalSteps} />
      {renderItems()}
    </div>
  )
}

export default memo(CaptureControls)
