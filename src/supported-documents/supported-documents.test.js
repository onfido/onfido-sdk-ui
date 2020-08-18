import { getSupportedCountriesForDocument } from './index.js'

describe('getSupportedCountriesForDocument', () => {
  it('should not contain any duplicate countries', () => {
    const supportedCountries = getSupportedCountriesForDocument(
      'driving_licence'
    )
    const countryCount = supportedCountries.filter(
      (country) => country.name === 'Singapore'
    ).length
    expect(countryCount).toEqual(1)
  })

  it('should return countries sorted alphabetically', () => {
    const supportedCountries = getSupportedCountriesForDocument(
      'national_identity_card'
    )
    const firstThreeCountries = supportedCountries.slice(0, 3)
    const expectedResult = [
      {
        country_alpha2: 'AL',
        country_alpha3: 'ALB',
        name: 'Albania',
      },
      {
        country_alpha2: 'DZ',
        country_alpha3: 'DZA',
        name: 'Algeria',
      },
      {
        country_alpha2: 'AO',
        country_alpha3: 'AGO',
        name: 'Angola',
      },
    ]
    expect(firstThreeCountries).toEqual(expectedResult)
  })

  it('should show a console error and return an empty array if given unsupported document type', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const supportedCountries = getSupportedCountriesForDocument(
      'unknown_document'
    )
    expect(consoleError).toHaveBeenCalled()
    expect(supportedCountries).toEqual([])
  })
})
