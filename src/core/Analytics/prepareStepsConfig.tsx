import { StepConfig } from '~types/steps'
import { pick } from '~utils/object'

// Only accept these keys in step.options
const keys = [
  'documentTypes',
  'forceCrossDevice',
  'useLiveDocumentCapture',
  'uploadFallback',
  'country',
  'requestedVariant',
  'useMultipleSelfieCapture',
  'photoCaptureFallback',
  'retries',
  'useUploader',
  'useWebcam',
]

export const cleanStepsForConfig = (steps: StepConfig[]): StepConfig[] =>
  steps.map(
    (step): StepConfig => {
      const options = pick(
        { ...step.options } as Partial<Record<string, unknown>>,
        keys
      )
      const newStep: StepConfig = { ...step }

      if (Object.keys(options).length) {
        newStep.options = convertKeysToSnakeCase(options)
      } else {
        delete newStep.options
      }

      return newStep
    }
  )

const convertKeysToSnakeCase = (obj: Record<string, unknown>) => {
  const newObj: Record<string, unknown> = {}
  Object.entries(obj).forEach(([key, value]: [string, unknown]) => {
    const k = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    newObj[k] = value
  })
  return newObj
}
