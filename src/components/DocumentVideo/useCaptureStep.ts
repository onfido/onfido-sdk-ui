import { useEffect, useReducer } from 'preact/compat'

import type { CaptureFlows, CaptureSteps, RecordState } from '~types/docVideo'

type CaptureStepActions = 'NEXT_CAPTURE_STEP' | 'RESET_CAPTURE_STEP'
type RecordStateActions = 'NEXT_RECORD_STATE' | 'RESET_RECORD_STATE'

type UseCaptureStepType = {
  nextStep: () => void
  nextRecordState: () => void
  restart: () => void
  recordState: RecordState
  captureStep: CaptureSteps
  stepNumber: number
  totalSteps: number
}

const STEPS_BY_FLOW: Record<CaptureFlows, CaptureSteps[]> = {
  passport: ['intro', 'front'],
  cardId: ['intro', 'front', 'back'],
}

const useCaptureStep = (captureFlow: CaptureFlows): UseCaptureStepType => {
  const captureStepReducer = (
    state: CaptureSteps,
    action: CaptureStepActions
  ): CaptureSteps => {
    if (action === 'RESET_CAPTURE_STEP') {
      return 'intro'
    }

    switch (state) {
      case 'intro':
        return 'front'

      case 'front': {
        switch (captureFlow) {
          case 'cardId':
            return 'back'

          default:
            return state
        }
      }

      default:
        return state
    }
  }

  const [captureStep, dispatchCaptureStep] = useReducer(
    captureStepReducer,
    'intro'
  )

  const initState = (step: CaptureSteps): RecordState =>
    step === 'intro' ? 'showButton' : 'hideButton'

  const recordStateReducer = (
    state: RecordState,
    action: RecordStateActions
  ): RecordState => {
    if (action === 'RESET_RECORD_STATE') {
      return initState(captureStep)
    }

    switch (state) {
      case 'hideButton':
        return 'showButton'

      case 'showButton':
        if (captureStep === 'intro') {
          return state
        }

        if (captureFlow === 'passport') {
          return 'holdingStill'
        }

        return 'success'

      case 'holdingStill':
        return 'success'

      default:
        return state
    }
  }

  const [recordState, dispatchRecordState] = useReducer(
    recordStateReducer,
    captureStep,
    initState
  )

  useEffect(() => {
    dispatchRecordState('RESET_RECORD_STATE')
  }, [captureStep])

  const possibleSteps = STEPS_BY_FLOW[captureFlow]
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
