import { useCallback, useEffect } from 'preact/hooks'
import useStateMachine, { MachineSpec } from '~utils/useStateMachine'

export type CaptureStepActions = 'NEXT_CAPTURE_STEP' | 'RESET_CAPTURE_STEP'
export type RecordStateActions = 'NEXT_RECORD_STATE' | 'RESET_RECORD_STATE'

type UseCaptureStepType<CaptureSteps, RecordState> = {
  nextStep: () => void
  nextRecordState: () => void
  restart: () => void
  recordState: RecordState
  captureStep: CaptureSteps
  stepNumber: number
  totalSteps: number
}

const useCaptureStep = <
  CaptureSteps extends string,
  RecordState extends string
>(
  captureFlow: CaptureSteps[],
  getCaptureStepSpec: () => MachineSpec<CaptureSteps, CaptureStepActions>,
  getRecordStateSpec: (
    captureStep: CaptureSteps
  ) => MachineSpec<RecordState, RecordStateActions>
): UseCaptureStepType<CaptureSteps, RecordState> => {
  const [captureStep, dispatchCaptureStep] = useStateMachine(
    getCaptureStepSpec()
  )

  const [recordState, dispatchRecordState] = useStateMachine(
    getRecordStateSpec(captureStep)
  )

  useEffect(() => {
    dispatchRecordState('RESET_RECORD_STATE')
  }, [captureStep, dispatchRecordState])

  const totalSteps = captureFlow.length - 1
  const stepNumber = captureFlow.indexOf(captureStep)

  const nextRecordState = useCallback(
    () => dispatchRecordState('NEXT_RECORD_STATE'),
    [dispatchRecordState]
  )
  const nextStep = useCallback(() => dispatchCaptureStep('NEXT_CAPTURE_STEP'), [
    dispatchCaptureStep,
  ])

  const restart = useCallback(() => dispatchCaptureStep('RESET_CAPTURE_STEP'), [
    dispatchCaptureStep,
  ])

  return {
    captureStep,
    nextRecordState,
    nextStep,
    recordState,
    restart,
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
