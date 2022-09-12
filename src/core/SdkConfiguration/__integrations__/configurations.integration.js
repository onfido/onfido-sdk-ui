import { getTestJwtToken } from 'components/utils/__integrations__/helpers'
import { getSdkConfiguration } from '~core/SdkConfiguration/getSdkConfiguration'
import { API_URL } from 'components/utils/__integrations__/helpers/testUrls'
import {
  ASSERT_EXPIRED_JWT_ERROR_OBJECT,
  EXPIRED_JWT_TOKEN,
} from 'components/utils/__integrations__/helpers/mockExpiredJwtAndResponse'

let jwtToken = null

describe('API configurations endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('getSdkConfiguration returns sdk features', async () => {
    process.env.SDK_SOURCE = 'onfido_web_sdk'
    process.env.SDK_VERSION = '8.3.0'

    const configurations = await getSdkConfiguration(API_URL, jwtToken)

    expect(configurations).toHaveProperty('sdk_features', {
      disable_cross_device_sms: false,
      enable_in_house_analytics: false,
      enable_on_device_face_detection: true,
      enable_require_applicant_consents: true,
    })
  })

  test('getSdkConfiguration for unknown source returns all sdk features disabled', async () => {
    process.env.SDK_SOURCE = 'i_am_unknown'
    process.env.SDK_VERSION = '8.3.0'

    const configurations = await getSdkConfiguration(API_URL, jwtToken)

    expect(configurations).toHaveProperty('sdk_features', {
      disable_cross_device_sms: false,
      enable_in_house_analytics: false,
      enable_on_device_face_detection: false,
      enable_require_applicant_consents: false,
    })
  })

  test('getSdkConfiguration for unknown sdk version returns configurations for the latest version', async () => {
    process.env.SDK_SOURCE = 'onfido_web_sdk'
    process.env.SDK_VERSION = '-1.0.007'

    const configurations = await getSdkConfiguration(API_URL, jwtToken)

    expect(configurations).toHaveProperty('sdk_features', {
      disable_cross_device_sms: false,
      enable_in_house_analytics: false,
      enable_on_device_face_detection: true,
      enable_require_applicant_consents: true,
    })
  })

  test('getSdkConfiguration returns an error if request is made with an expired JWT token', async () => {
    process.env.SDK_SOURCE = 'onfido_web_sdk'
    process.env.SDK_VERSION = '8.3.0'

    expect.assertions(1)

    await getSdkConfiguration(API_URL, EXPIRED_JWT_TOKEN).catch((err) => {
      expect(err).toMatchObject(ASSERT_EXPIRED_JWT_ERROR_OBJECT)
    })
  })
})
