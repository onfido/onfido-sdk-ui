// @flow
import supportedDrivingLicences from './supported-docs-driving_licence.json'
import supportedNationalIDCards from './supported-docs-national_identity_card.json'
import supportedResidencePermit from './supported-docs-residence_permit.json'

export type CountryType = {
  country_alpha2: string,
  country_alpha3: string,
  name: string,
}

export const getCountryDataForDocumentType = (
  countryCode: string,
  documentType: string
) => {
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

export const getSupportedCountriesForDocument = (documentType: string) => {
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

const getCountriesList = (supportedDocsData: Array<object>) => {
  const countriesList = supportedDocsData.map((docData) => {
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
