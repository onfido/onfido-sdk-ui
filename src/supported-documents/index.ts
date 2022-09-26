/* eslint-disable @typescript-eslint/no-var-requires */
const supportedDrivingLicences = require('./supported-docs-driving_licence.json')
const supportedNationalIDCards = require('./supported-docs-national_identity_card.json')
const supportedResidencePermit = require('./supported-docs-residence_permit.json')
const supportedPassport = require('./supported-docs-passport.json')

import type { CountryData, documentSelectionType } from '~types/commons'
import type { DocumentTypes } from '~types/steps'

type SourceData = {
  country_alpha2: string
  country_alpha3: string
  country: string
  document_type: string
}

type FlagShapes = 'rectangle' | 'square'

const FLAGS_FOLDER_BY_SHAPE: Record<FlagShapes, string> = {
  rectangle: '4x3',
  square: '1x1',
}

const documentTypeMap: Record<string, string> = {
  DLD: 'driving_licence',
  NIC: 'national_identity_card',
  REP: 'residence_permit',
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

export const getSupportedCountries = (
  filterList?: documentSelectionType[]
): CountryData[] => {
  const allSupportedDocumentTypes = supportedDrivingLicences
    .concat(supportedNationalIDCards)
    .concat(supportedResidencePermit)
    .concat(supportedPassport)

  return filterList
    ? getCountriesList(allSupportedDocumentTypes).filter((el) => {
        return filterList.some((f) => {
          return f.issuing_country === el.country_alpha3
        })
      })
    : getCountriesList(allSupportedDocumentTypes)
}

export const getSupportedDocumentTypes = (country: string): string[] => {
  return supportedDrivingLicences
    .concat(supportedNationalIDCards)
    .concat(supportedResidencePermit)
    .filter(
      (docData: { sourceData: SourceData }) =>
        docData.sourceData.country_alpha3 === country
    )
    .map(
      (docData: { sourceData: SourceData }) =>
        documentTypeMap[docData.sourceData.document_type]
    )
    .concat(['passport'])
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
    case 'passport':
      return getCountriesList(supportedPassport)
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

  const map = new Map(
    countriesList.map((country) => [country.country_alpha3, country])
  )

  const uniqueCountriesList = []

  for (const v of map.values()) {
    uniqueCountriesList.push(v)
  }

  return uniqueCountriesList.sort((a, b) => a.name.localeCompare(b.name))
}
