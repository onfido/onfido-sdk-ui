import { useCallback, useState } from 'preact/compat'

import type { CaptureSteps } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

type UseCaptureStepType = {
  nextStep: () => void
  restart: () => void
  step: CaptureSteps
  stepNumber: number
  totalSteps: number
}

const useCaptureStep = (documentType: DocumentTypes): UseCaptureStepType => {
  const [currentStep, setCurrentStep] = useState<CaptureSteps>('intro')

  const possibleSteps: CaptureSteps[] =
    documentType === 'passport' ? ['front', 'tilt'] : ['front', 'tilt', 'back']

  const stepNumber =
    currentStep === 'intro' ? 0 : possibleSteps.indexOf(currentStep) + 1
  const totalSteps = possibleSteps.length

  const nextStep = useCallback(() => {
    if (stepNumber >= totalSteps) {
      return
    }

    // `stepNumber` is always step index + 1
    setCurrentStep(possibleSteps[stepNumber])
  }, [possibleSteps, stepNumber, totalSteps])

  return {
    step: currentStep,
    stepNumber,
    totalSteps,
    nextStep,
    restart: () => setCurrentStep('intro'),
  }
}

export default useCaptureStep
