import {
  getApplicantConsents,
  updateApplicantConsents,
  updateApplicantLocation,
} from '../../onfidoApi'
import { getTestApplicantUUID, getTestJwtToken } from '../helpers'
import { API_URL } from '../helpers/testUrls'

let jwtToken = null
let applicantUUID = null

describe('API consents endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
    applicantUUID = await getTestApplicantUUID()
  })

  test('getApplicantConsents returns expected properties in response', async () => {
    const applicantConsents = await getApplicantConsents(
      applicantUUID,
      API_URL,
      jwtToken
    )

    expect(applicantConsents).toHaveLength(1)
    expect(applicantConsents[0]).toHaveProperty('granted', false)
    expect(applicantConsents[0]).toHaveProperty('name', 'privacy_notices_read')
    expect(applicantConsents[0]).toHaveProperty('required', true)
  })

  test('updateApplicantConsents returns an empty response', async () => {
    const applicantConsents = [
      {
        name: 'privacy_notices_read',
        granted: true,
      },
    ]

    const applicantConsentsUpdated = await updateApplicantConsents(
      applicantUUID,
      applicantConsents,
      API_URL,
      jwtToken
    )

    expect(applicantConsentsUpdated).toStrictEqual('')
  })

  test('getApplicantConsents returns updated consents', async () => {
    const applicantConsents = [
      {
        name: 'privacy_notices_read',
        granted: true,
      },
    ]

    await updateApplicantConsents(
      applicantUUID,
      applicantConsents,
      API_URL,
      jwtToken
    )

    const applicantConsentsUpdated = await getApplicantConsents(
      applicantUUID,
      API_URL,
      jwtToken
    )

    expect(applicantConsents).toHaveLength(1)
    expect(applicantConsentsUpdated[0]).toHaveProperty('granted', true)
  })
})

describe('API applicant location endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
    applicantUUID = await getTestApplicantUUID()
  })

  test('updateApplicantLocation returns empty response on success', async () => {
    const applicantLocation = await updateApplicantLocation(
      applicantUUID,
      API_URL,
      jwtToken
    )

    expect(applicantLocation).toStrictEqual('')
  })

  test('updateApplicantLocation returns error response on applicant not found', async () => {
    const invalidApplicantUUID = '12345678-1234-1234-1234-123456789abc'

    expect.assertions(1)

    await updateApplicantLocation(
      invalidApplicantUUID,
      API_URL,
      jwtToken
    ).catch((applicantLocation) => {
      expect(applicantLocation).toHaveProperty(
        'response.error.type',
        'resource_not_found'
      )
    })
  })
})
