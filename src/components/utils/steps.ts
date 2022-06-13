import type {
  DocumentTypes,
  StepTypes,
  StepConfig,
  StepConfigMap,
} from '~types/steps'

import type { ComponentStep } from '~types/routers'

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
  const findStep = buildStepFinder(steps)
  const documentStep = findStep('document')
  const docTypes = documentStep?.options?.documentTypes

  if (!docTypes) {
    return []
  }

  const configuredDocTypes = Object.keys(docTypes) as DocumentTypes[]
  return configuredDocTypes.filter((type) => docTypes[type])
}

export const findFirstIndex = (
  componentsList: ComponentStep[],
  clientStepIndex: number
) => componentsList.findIndex(({ stepIndex }) => stepIndex === clientStepIndex)

export const findFirstEnabled = (componentsList: ComponentStep[]) =>
  componentsList.findIndex((c) => !c.step.skip)
