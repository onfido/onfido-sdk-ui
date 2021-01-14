/* eslint-disable @typescript-eslint/no-var-requires */
const supportedDrivingLicences = require('./supported-docs-driving_licence.json')
const supportedNationalIDCards = require('./supported-docs-national_identity_card.json')
const supportedResidencePermit = require('./supported-docs-residence_permit.json')

import type { CountryData } from '~types/commons'
import type { DocumentTypes } from '~types/steps'

type SourceData = {
  country_alpha2: string
  country_alpha3: string
  country: string
}

export const getCountryDataForDocumentType = (
  countryCode: Optional<string>,
  documentType: DocumentTypes
): Optional<CountryData> => {
  // Consistent with API, which accepts a 3-letter ISO country code for issuing_country param value
  if (countryCode && countryCode.length === 3) {
    const supportedCountriesList = getSupportedCountriesForDocument(
      documentType
    )
    const country = supportedCountriesList.find(
      (countryData) => countryData.country_alpha3 === countryCode
    )
    return country
  }
  return null
}

export const getSupportedCountriesForDocument = (
  documentType: DocumentTypes
): CountryData[] => {
  switch (documentType) {
    case 'driving_licence':
      return getCountriesList(supportedDrivingLicences)
    case 'national_identity_card':
      return getCountriesList(supportedNationalIDCards)
    case 'residence_permit':
      return getCountriesList(supportedResidencePermit)
    default:
      console.error('Unsupported documentType:', documentType)
      return []
  }
}

const getCountriesList = (supportedDocsData: { sourceData: SourceData }[]) => {
  const countriesList: CountryData[] = supportedDocsData.map((docData) => {
    const { sourceData } = docData
    return {
      country_alpha2: sourceData.country_alpha2,
      country_alpha3: sourceData.country_alpha3,
      name: sourceData.country,
    }
  })

  const uniqueCountriesList = [
    ...new Map(
      countriesList.map((country) => [country.country_alpha3, country])
    ).values(),
  ]

  return uniqueCountriesList.sort((a, b) => a.name.localeCompare(b.name))
}
