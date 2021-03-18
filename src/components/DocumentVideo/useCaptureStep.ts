import { useEffect, useReducer } from 'preact/compat'

import type {
  CaptureFlows,
  CaptureSteps,
  CaptureActions,
  RecordState,
} from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

type UseCaptureStepType = {
  nextStep: () => void
  nextRecordState: () => void
  restart: () => void
  recordState: RecordState
  step: CaptureSteps
  stepNumber: number
  totalSteps: number
}

const STEPS_BY_FLOW: Record<CaptureFlows, CaptureSteps[]> = {
  passport: ['intro', 'front'],
  cardId: ['intro', 'front', 'back'],
}

const useCaptureStep = (documentType: DocumentTypes): UseCaptureStepType => {
  const captureFlow: CaptureFlows =
    documentType === 'passport' ? 'passport' : 'cardId'

  const stepReducer = (
    state: CaptureSteps,
    action: CaptureActions
  ): CaptureSteps => {
    if (action === 'RESET_STEP') {
      return 'intro'
    }

    if (action === 'NEXT_STEP') {
      switch (state) {
        case 'intro':
          return 'front'

        case 'front':
          return captureFlow === 'cardId' ? 'back' : state

        default:
          return state
      }
    }

    return state
  }

  const [captureStep, dispatchCaptureStep] = useReducer(stepReducer, 'intro')

  const initState = (step: CaptureSteps): RecordState =>
    step === 'intro' ? 'showButton' : 'hideButton'

  const stateReducer = (
    state: RecordState,
    action: CaptureActions
  ): RecordState => {
    if (action === 'NEXT_STEP') {
      return initState(captureStep)
    }

    if (action === 'NEXT_RECORD_STATE') {
      switch (state) {
        case 'hideButton':
          return 'showButton'

        case 'showButton':
          if (captureStep === 'intro') {
            return state
          }

          if (documentType === 'passport') {
            return 'holdingStill'
          }

          return 'success'

        case 'holdingStill':
          return 'success'

        default:
          return state
      }
    }

    return state
  }

  const [recordState, dispatchRecordState] = useReducer(
    stateReducer,
    captureStep,
    initState
  )

  useEffect(() => {
    dispatchRecordState('NEXT_STEP')
  }, [captureStep])

  const possibleSteps = STEPS_BY_FLOW[captureFlow]
  const totalSteps = possibleSteps.length - 1
  const stepNumber = possibleSteps.indexOf(captureStep)

  return {
    nextRecordState: () => dispatchRecordState('NEXT_RECORD_STATE'),
    nextStep: () => dispatchCaptureStep('NEXT_STEP'),
    recordState,
    restart: () => dispatchCaptureStep('RESET_STEP'),
    step: captureStep,
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
