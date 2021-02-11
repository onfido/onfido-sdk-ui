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

  const totalSteps = possibleSteps.length

  const getStepNumber = useCallback((): number => {
    if (currentStep === 'intro') {
      return 0
    }

    if (currentStep === 'complete') {
      return totalSteps
    }

    return possibleSteps.indexOf(currentStep) + 1
  }, [currentStep, possibleSteps, totalSteps])

  const nextStep = useCallback(() => {
    if (currentStep === 'complete') {
      return
    }

    const stepIndex = possibleSteps.indexOf(currentStep)

    if (stepIndex === possibleSteps.length - 1) {
      setCurrentStep('complete')
      return
    }

    setCurrentStep(possibleSteps[stepIndex + 1])
  }, [currentStep, possibleSteps])

  return {
    step: currentStep,
    stepNumber: getStepNumber(),
    totalSteps,
    nextStep,
    restart: () => setCurrentStep('intro'),
  }
}

export default useCaptureStep
