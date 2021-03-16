import { useCallback, useState } from 'preact/compat'

import type { DocumentTypes } from '~types/steps'

type UseCaptureStepType = {
  nextStep: () => void
  restart: () => void
  stepNumber: number
  totalSteps: number
}

const useCaptureStep = (documentType: DocumentTypes): UseCaptureStepType => {
  const [stepNumber, setStepNumber] = useState<number>(0)

  const totalSteps = documentType === 'passport' ? 1 : 2

  const nextStep = useCallback(() => {
    if (stepNumber >= totalSteps) {
      return
    }

    setStepNumber(stepNumber + 1)
  }, [stepNumber, totalSteps])

  return {
    stepNumber,
    totalSteps,
    nextStep,
    restart: () => setStepNumber(0),
  }
}

export default useCaptureStep
