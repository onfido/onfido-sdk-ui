import { useCallback, useEffect, useReducer, useState } from 'preact/compat'

import type { RecordState, RecordActions } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

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

  const reducer = (state: RecordState, action: RecordActions): RecordState => {
    if (action === 'NEXT_STEP') {
      return stepNumber === 0 ? 'showButton' : 'hideButton'
    }

    switch (state) {
      case 'hideButton':
        return 'showButton'

      case 'showButton':
        if (stepNumber === 0) {
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

  const [recordState, transitState] = useReducer(
    reducer,
    stepNumber === 0 ? 'showButton' : 'hideButton'
  )

  useEffect(() => {
    transitState('NEXT_STEP')
  }, [stepNumber])

  const totalSteps = documentType === 'passport' ? 1 : 2

  const nextStep = useCallback(() => {
    if (stepNumber >= totalSteps) {
      return
    }

    setStepNumber(stepNumber + 1)
  }, [stepNumber, totalSteps])

  return {
    nextRecordState: () => transitState('NEXT_RECORD_STATE'),
    nextStep,
    recordState,
    restart: () => setStepNumber(0),
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
