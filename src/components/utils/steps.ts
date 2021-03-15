import type {
  DocumentTypes,
  StepTypes,
  StepConfig,
  StepConfigMap,
} from '~types/steps'

export type FindStepCallback = <T extends StepTypes>(
  type: T
) => Partial<StepConfigMap>[T]

export const buildStepFinder = (steps: StepConfig[]): FindStepCallback => {
  const mappedSteps = Object.fromEntries(
    steps.map((step) => [step.type, step])
  ) as Partial<StepConfigMap>

  return (type) => mappedSteps[type]
}

export const hasOnePreselectedDocument = (steps: StepConfig[]): boolean =>
  getEnabledDocuments(steps).length === 1

export const getEnabledDocuments = (steps: StepConfig[]): DocumentTypes[] => {
  const documentStep = buildStepFinder(steps)('document')
  const docTypes = documentStep?.options?.documentTypes

  if (!docTypes) {
    return []
  }

  const configuredDocTypes = Object.keys(docTypes) as DocumentTypes[]
  return configuredDocTypes.filter((type) => docTypes[type])
}
