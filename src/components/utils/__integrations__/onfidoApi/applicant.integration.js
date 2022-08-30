import { getApplicantConsents, updateApplicantConsents } from '../../onfidoApi'
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
