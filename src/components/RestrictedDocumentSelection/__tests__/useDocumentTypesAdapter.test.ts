import { renderHook } from '@testing-library/preact-hooks'
import { useDocumentTypesAdapter } from '../useDocumentTypesAdapter'
import { DocumentTypeConfig, DocumentTypes, StepConfig } from '~types/steps'
import * as assert from 'assert'
import { buildStepFinder } from '~utils/steps'
import { getSupportedCountriesForDocument } from '~supported-documents'

const createSteps = (
  documentTypes: Partial<Record<DocumentTypes, DocumentTypeConfig>>
): StepConfig[] => {
  return [
    { type: 'welcome' },
    { type: 'document', options: { documentTypes } },
    { type: 'complete' },
  ]
}

const getDocumentStepOption = (steps: StepConfig[]) => {
  const findStep = buildStepFinder(steps)
  const options = findStep('document')?.options
  assert(options)
  return options
}

const renderUseDocumentTypesAdapter = () => {
  const { result } = renderHook(() => useDocumentTypesAdapter())
  assert(result.current)
  return result.current
}

describe('useDocumentTypes', () => {
  it('ignores "null" country value', () => {
    const { documentTypesAdapter } = renderUseDocumentTypesAdapter()

    const steps = documentTypesAdapter(
      createSteps({
        residence_permit: {
          country: null,
        },
      })
    )

    // @ts-ignore
    const { documentSelection, countryFilter } = getDocumentStepOption(steps)

    expect(documentSelection).toBeUndefined()
    expect(countryFilter).toBeUndefined()
  })

  it('create a filter for a single country when country is not "null"', () => {
    const { documentTypesAdapter } = renderUseDocumentTypesAdapter()

    const steps = documentTypesAdapter(
      createSteps({
        residence_permit: {
          country: 'ESP',
        },
        driving_licence: {
          country: 'ESP',
        },
      })
    )

    // @ts-ignore
    const { documentSelection, countryFilter } = getDocumentStepOption(steps)

    expect(documentSelection).toEqual([
      {
        id: '',
        config: {},
        document_type: 'residence_permit',
        issuing_country: 'ESP',
      },
      {
        id: '',
        config: {},
        document_type: 'driving_licence',
        issuing_country: 'ESP',
      },
    ])
    expect(countryFilter).toEqual([
      {
        id: '',
        config: {},
        document_type: 'residence_permit',
        issuing_country: 'ESP',
      },
    ])
  })

  it('create a filter for all supported country when value is true', () => {
    const { documentTypesAdapter } = renderUseDocumentTypesAdapter()
    const steps = documentTypesAdapter(
      createSteps({
        residence_permit: {
          country: 'ESP',
        },
        driving_licence: true,
      })
    )

    // @ts-ignore
    const { documentSelection, countryFilter } = getDocumentStepOption(steps)

    expect(documentSelection.length).toEqual(
      // All countries for driving_license + one country for resident_permit
      getSupportedCountriesForDocument('driving_licence').length + 1
    )

    // All countries for driving_license + resident_permit
    expect(countryFilter.length).toEqual(
      getSupportedCountriesForDocument('driving_licence').length
    )
  })
})
