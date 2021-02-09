import { useCallback, useState } from 'preact/compat'

import type { CaptureSteps } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

type UseCaptureStepType = {
  step: CaptureSteps
  hasMoreSteps: boolean
  nextStep: () => void
  restart: () => void
}

const useCaptureStep = (documentType: DocumentTypes): UseCaptureStepType => {
  const [currentStep, setCurrentStep] = useState<CaptureSteps>('intro')

  const possibleSteps: CaptureSteps[] =
    documentType === 'passport' ? ['front', 'tilt'] : ['front', 'tilt', 'back']

  const hasMoreSteps =
    possibleSteps.indexOf(currentStep) < possibleSteps.length - 1

  const nextStep = useCallback(() => {
    if (!hasMoreSteps) {
      return
    }

    const currentStepIndex = possibleSteps.indexOf(currentStep)
    const nextStep = possibleSteps[currentStepIndex + 1]
    setCurrentStep(nextStep)
  }, [currentStep, possibleSteps, hasMoreSteps])

  return {
    step: currentStep,
    hasMoreSteps,
    nextStep,
    restart: () => setCurrentStep('intro'),
  }
}

export default useCaptureStep
