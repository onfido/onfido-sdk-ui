// @flow
import supportedDrivingLicences from './supported-docs-driving_licence.json'
import supportedNationalIDCards from './supported-docs-national_identity_card.json'

export type CountryType = {
  countryCode: string,
  name: string,
  icon?: string,
}

export const getSupportedCountriesForDocument = (documentType) => {
  switch (documentType) {
    case 'driving_licence':
      return getCountriesList(supportedDrivingLicences)
    case 'national_identity_card':
      return getCountriesList(supportedNationalIDCards)
    default:
      console.error('Unsupported documentType:', documentType)
      return []
  }
}

const getCountriesList = (supportedDocsData) => {
  const countriesList = supportedDocsData.map((docData) => {
    const { sourceData } = docData
    return {
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
