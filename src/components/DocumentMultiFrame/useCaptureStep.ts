//TODO: Update useCaptureStep from DocumentVideo and share it.
import { useEffect } from 'preact/hooks'
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
  }, [captureStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const possibleSteps = captureFlow //stepsByFlow[captureFlow]
  const totalSteps = possibleSteps.length - 1
  const stepNumber = possibleSteps.indexOf(captureStep)

  return {
    captureStep,
    nextRecordState: () => dispatchRecordState('NEXT_RECORD_STATE'),
    nextStep: () => dispatchCaptureStep('NEXT_CAPTURE_STEP'),
    recordState,
    restart: () => dispatchCaptureStep('RESET_CAPTURE_STEP'),
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
