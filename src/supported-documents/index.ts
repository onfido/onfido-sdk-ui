/* eslint-disable @typescript-eslint/no-var-requires */
const supportedDrivingLicences = require('./supported-docs-driving_licence.json')
const supportedNationalIDCards = require('./supported-docs-national_identity_card.json')
const supportedResidencePermit = require('./supported-docs-residence_permit.json')
const supportedProofOfAddress = require('./supported-countries-poa.json')

import type { CountryData } from '~types/commons'
import type { DocumentTypes, PoaTypes } from '~types/steps'

type SourceData = {
  country_alpha2: string
  country_alpha3: string
  country: string
}

type FlagShapes = 'rectangle' | 'square'

const FLAGS_FOLDER_BY_SHAPE: Record<FlagShapes, string> = {
  rectangle: '4x3',
  square: '1x1',
}

export const getCountryFlagSrc = (
  countryCode: string,
  flagShape: FlagShapes
): string =>
  `${process.env.COUNTRY_FLAGS_SRC}${
    FLAGS_FOLDER_BY_SHAPE[flagShape]
  }/${countryCode.toLowerCase()}.svg`

export const getCountryDataForDocumentType = (
  countryCode: Optional<string>,
  documentType: Optional<DocumentTypes>
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

export const getSupportedCountriesForProofOfAddress = (
  poaDocumentType: Optional<PoaTypes>
): CountryData[] => {
  const countriesList: CountryData[] = supportedProofOfAddress
    .filter((country: { document_types: PoaTypes[] }) => {
      if (poaDocumentType) {
        return country.document_types.includes(poaDocumentType)
      }
      return true
    })
    .map(
      (countryData: {
        country_alpha2: string
        country_alpha3: string
        country: string
      }) => {
        return {
          country_alpha2: countryData.country_alpha2,
          country_alpha3: countryData.country_alpha3,
          name: countryData.country,
        }
      }
    )

  const uniqueCountriesList = [
    ...new Map(
      countriesList.map((country) => [country.country_alpha3, country])
    ).values(),
  ]

  return uniqueCountriesList.sort((a, b) => a.name.localeCompare(b.name))
}

export const getSupportedCountriesForDocument = (
  documentType: Optional<DocumentTypes>
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
