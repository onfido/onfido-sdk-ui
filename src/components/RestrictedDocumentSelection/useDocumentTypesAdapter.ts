import {
  getCountryDataForDocumentType,
  getSupportedCountriesForDocument,
} from '~supported-documents'
import {
  CountryConfig,
  DocumentTypes,
  StepConfig,
  StepConfigDocument,
} from '~types/steps'
import { documentSelectionType } from '~types/commons'
import { useCallback } from 'preact/hooks'

const getCountryFilter = (
  config: Array<documentSelectionType>
): Array<documentSelectionType> =>
  config &&
  config.filter((value, index, self) => {
    return (
      self.findIndex((v) => v.issuing_country === value.issuing_country) ===
      index
    )
  })

export const useDocumentTypesAdapter = () => {
  const documentTypesAdapter = useCallback(
    (steps: StepConfig[]): StepConfig[] => {
      // Adapt current `documentTypes` options for Restricted Document
      const documentStepIndex = steps.findIndex(
        ({ type }) => type === 'document'
      )
      const documentStep = steps[documentStepIndex] as StepConfigDocument
      const documentTypes = documentStep?.options?.documentTypes

      if (!documentTypes) {
        return steps
      }

      const documentTypesKeys = Object.keys(documentTypes) as DocumentTypes[]
      const documentSelection: documentSelectionType[] = []

      documentTypesKeys.forEach((type) => {
        if (
          typeof documentTypes[type] === 'boolean' &&
          documentTypes[type] === true
        ) {
          // Display this document type for all supported countries
          getSupportedCountriesForDocument(type).map((countryData) =>
            documentSelection.push({
              document_type: type,
              issuing_country: countryData.country_alpha3,
              config: {},
              id: '',
            })
          )
        }

        // Display this document type for a single country
        const country = (documentTypes[type] as CountryConfig).country
        const countryData = getCountryDataForDocumentType(country, type)
        if (countryData) {
          documentSelection.push({
            document_type: type,
            issuing_country: countryData.country_alpha3,
            config: {},
            id: '',
          })
        }
      })

      if (documentSelection.length === 0) {
        return steps
      }

      const countryFilter = getCountryFilter(documentSelection)

      return [
        ...steps.slice(0, documentStepIndex),
        {
          ...documentStep,
          options: {
            ...documentStep.options,
            //@ts-ignore
            documentSelection,
            countryFilter,
          },
        },
        ...steps.slice(documentStepIndex + 1),
      ]
    },
    []
  )
  return { documentTypesAdapter }
}
