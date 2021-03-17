import { useCallback, useEffect, useReducer, useState } from 'preact/compat'

import type { DocumentTypes } from '~types/steps'

export type RecordState =
  | 'hideButton'
  | 'showButton'
  | 'holdingStill'
  | 'success'

type UseCaptureStepType = {
  nextStep: () => void
  nextRecordState: () => void
  restart: () => void
  recordState: RecordState
  stepNumber: number
  totalSteps: number
}

const useCaptureStep = (documentType: DocumentTypes): UseCaptureStepType => {
  const [stepNumber, setStepNumber] = useState<number>(0)

  const reducer = (
    state: RecordState,
    action: 'nextStep' | 'nextRecordState'
  ): RecordState => {
    if (action === 'nextStep') {
      return stepNumber === 0 ? 'showButton' : 'hideButton'
    }

    switch (state) {
      case 'hideButton':
        return 'showButton'

      case 'showButton':
        return stepNumber === 0 ? state : 'success'

      default:
        return state
    }
  }

  const [recordState, transitState] = useReducer(
    reducer,
    stepNumber === 0 ? 'showButton' : 'hideButton'
  )

  useEffect(() => {
    transitState('nextStep')
  }, [stepNumber])

  const totalSteps = documentType === 'passport' ? 1 : 2

  const nextStep = useCallback(() => {
    if (stepNumber >= totalSteps) {
      return
    }

    setStepNumber(stepNumber + 1)
  }, [stepNumber, totalSteps])

  return {
    nextRecordState: () => transitState('nextRecordState'),
    nextStep,
    recordState,
    restart: () => setStepNumber(0),
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
