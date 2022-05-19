import { h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import useUserConsent, { UserConsentProvider } from '../useUserConsent'
import { SdkConfigurationServiceContext } from '~contexts/useSdkConfigurationService'
import { getApplicantConsents } from '~utils/onfidoApi'
import { StepConfig } from '~types/steps'
import * as assert from 'assert'

jest.mock('~utils/onfidoApi')

const getApplicantConsentsMock = getApplicantConsents as jest.MockedFn<
  typeof getApplicantConsents
>

const verifyUserConsentStepIndex = (
  steps: StepConfig[] | undefined,
  index: number
) => {
  assert(steps)
  expect(steps.findIndex(({ type }) => type === 'userConsent')).toEqual(index)
}

const applicantConsents = [
  {
    name: 'privacy_notices_read',
    granted: false,
    required: true,
  },
]

const url = 'http://localhost'
const token =
  'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2NDc5MDAxMDAsInBheWxvYWQiOnsiYXBwIjoiYzU3M2ZkNjYtZDc0Ni00NWM5LTkwOTItNTZiMjFhYzQ5OTFkIiwiY2xpZW50X3V1aWQiOiIwNmE5Y2EwOC1iMDNiLTQwMzAtOGNjMC05NDNiZGMyMmVlZDUiLCJpc19zYW5kYm94IjpmYWxzZSwicmVmIjoiKjovLyovKiIsInNhcmRpbmVfc2Vzc2lvbiI6IjVjOGVjNjdiLTM3MzktNDVmMi1iYzM3LTExOGRiNGUxZmMzMiJ9LCJ1dWlkIjoidDhWZ3N1b1dyekkiLCJ1cmxzIjp7InRlbGVwaG9ueV91cmwiOiJodHRwczovL3RlbGVwaG9ueS5vbmZpZG8uY29tIiwiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20ifX0.MIGIAkIBr7R5b5nfECNQjHJd5J09zrUJoeP-LxIbpUvaXiUL-B1O9hK9NtYsEpZHSy6vWwktrARCvYTa5c-uz8gxMfn7WDYCQgEjEYuAm_ZRIKK6nlfK9WmIciTER3pU-4yfrGLJ3ZKMzNI3EcN16Dv4lunmDqq5a-RsSUSc81gnmKg95B9k4Pvy0g'

// @ts-ignore
const wrapper = ({ children, enable_require_applicant_consents }) => (
  <SdkConfigurationServiceContext.Provider
    value={{
      sdk_features: {
        enable_require_applicant_consents,
      },
      document_capture: {
        max_total_retries: 0,
      },
    }}
  >
    <UserConsentProvider token={token} url={url}>
      {children}
    </UserConsentProvider>
  </SdkConfigurationServiceContext.Provider>
)

const renderUserConsentHook = (enabled = true) =>
  renderHook(() => useUserConsent(), {
    // @ts-ignore
    wrapper,
    initialProps: { enable_require_applicant_consents: enabled },
  })

describe('useUserConsent', () => {
  beforeAll(() => {
    getApplicantConsentsMock.mockResolvedValue(applicantConsents)
  })

  it('does not retrieve consents if Feature Flag is off', () => {
    const { result } = renderUserConsentHook(false)

    expect(result.current?.enabled).toBeFalsy()
    expect(result.current?.consents).toEqual([])
  })

  it('retrieves consents if Feature Flag on', async () => {
    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    expect(result.current?.enabled).toBeTruthy()
    expect(result.current?.consents).toEqual(applicantConsents)
  })

  it('updates consents status', async () => {
    const { result, waitForNextUpdate } = renderUserConsentHook()
    await waitForNextUpdate()

    result.current?.updateConsents(true)
    expect(result.current?.consents?.every(({ granted }) => !!granted))

    result.current?.updateConsents(false)
    expect(result.current?.consents?.every(({ granted }) => !granted))
  })

  it('enable consents if network calls fail', async () => {
    getApplicantConsentsMock.mockRejectedValue(undefined)

    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    expect(result.current?.consents).toEqual(applicantConsents)
  })

  it('adds "userConsent" after "welcome" step', async () => {
    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    const steps = result.current?.addUserConsentStep([{ type: 'welcome' }])
    verifyUserConsentStepIndex(steps, 1)
  })

  it('adds "userConsent" and does not skips step if required consents not granted', async () => {
    getApplicantConsentsMock.mockResolvedValue([
      {
        name: 'privacy_notices_read_consent_given',
        granted: false,
        required: true,
      },
      {
        name: 'other_consent',
        granted: false,
        required: false,
      },
      {
        name: 'an_other_consent',
        granted: true,
        required: false,
      },
    ])

    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    const steps = result.current?.addUserConsentStep([{ type: 'welcome' }])

    assert(steps)
    verifyUserConsentStepIndex(steps, 1)
    expect(steps[1].skip).toBeFalsy()
  })

  it('adds "userConsent" and skips step if required consents already granted', async () => {
    getApplicantConsentsMock.mockResolvedValue([
      {
        name: 'privacy_notices_read_consent_given',
        granted: true,
        required: true,
      },
      {
        name: 'other_consent',
        granted: false,
        required: false,
      },
      {
        name: 'an_other_consent',
        granted: true,
        required: false,
      },
    ])

    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    const steps = result.current?.addUserConsentStep([{ type: 'welcome' }])

    assert(steps)
    verifyUserConsentStepIndex(steps, 1)
    expect(steps[1].skip).toBeTruthy()
  })

  it('does not add "userConsent" step if Feature Flag is not enabled', () => {
    const { result } = renderUserConsentHook(false)

    const steps = result.current?.addUserConsentStep([{ type: 'welcome' }])
    verifyUserConsentStepIndex(steps, -1)
  })

  it('does not add "userConsent" step if consents not required', async () => {
    getApplicantConsentsMock.mockResolvedValue([
      {
        name: 'privacy_notices_read',
        granted: true,
        required: false,
      },
      {
        name: 'other_consent',
        granted: false,
        required: false,
      },
    ])

    const { result, waitForNextUpdate } = renderUserConsentHook()

    await waitForNextUpdate()

    const steps = result.current?.addUserConsentStep([{ type: 'welcome' }])

    verifyUserConsentStepIndex(steps, -1)
  })
})
