import type { DocumentTypes } from '~types/steps'
import { getSupportedCountriesForDocument } from '../index'

describe('getSupportedCountriesForDocument', () => {
  it('should not contain any duplicate countries', () => {
    const supportedCountries = getSupportedCountriesForDocument()
    const countryCount = supportedCountries.filter(
      (country) => country.name === 'Singapore'
    ).length
    expect(countryCount).toEqual(1)
  })

  it('should return countries sorted alphabetically', () => {
    const supportedCountries = getSupportedCountriesForDocument()
    const firstFourCountries = supportedCountries.slice(0, 4)
    const expectedResult = [
      {
        country_alpha2: 'AX',
        country_alpha3: 'ALA',
        name: 'Åland Islands',
      },
      {
        country_alpha2: 'AL',
        country_alpha3: 'ALB',
        name: 'Albania | Shqipëria',
      },
      {
        country_alpha2: 'DZ',
        country_alpha3: 'DZA',
        name: 'Algeria | الجزائر',
      },
      {
        country_alpha2: 'AS',
        country_alpha3: 'ASM',
        name: 'American Samoa',
      },
    ]
    expect(firstFourCountries).toEqual(expectedResult)
  })
})
