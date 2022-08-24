import { getPoASupportedCountries } from '../../onfidoApi'
import { getTestJwtToken } from '../helpers'
import { API_URL } from '../helpers/testUrls'

let jwtToken = null

describe('API getPoASupportedCountries endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('getPoASupportedCountries returns expected properties in response', async () => {
    const supportedCountries = await getPoASupportedCountries(API_URL, jwtToken)

    expect.hasAssertions()

    supportedCountries.forEach((supportedCountry) => {
      expect(supportedCountry).toHaveProperty('country_alpha3')
      expect(supportedCountry).toHaveProperty('country_alpha2')
      expect(supportedCountry).toHaveProperty('country')
      expect(supportedCountry).toHaveProperty('document_types')
    })
  })
})
