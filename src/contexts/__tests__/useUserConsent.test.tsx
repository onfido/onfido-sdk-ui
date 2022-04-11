import { h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import useUserConsent, { UserConsentProvider } from '../useUserConsent'
import { SdkConfigurationServiceContext } from '~contexts/useSdkConfigurationService'
import { getApplicantConsents } from '~utils/onfidoApi'

jest.mock('~utils/onfidoApi')

const getApplicantConsentsMock = getApplicantConsents as jest.MockedFn<
  typeof getApplicantConsents
>

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
    }}
  >
    <UserConsentProvider token={token} url={url}>
      {children}
    </UserConsentProvider>
  </SdkConfigurationServiceContext.Provider>
)

describe('useUserConsent', () => {
  beforeAll(() => {
    getApplicantConsentsMock.mockResolvedValue(applicantConsents)
  })
  it('does not retrieve consents if Feature Flag is off', () => {
    const { result } = renderHook(() => useUserConsent(), {
      // @ts-ignore
      wrapper,
      initialProps: { enable_require_applicant_consents: false },
    })

    expect(result.current?.enabled).toEqual(false)
    expect(result.current?.consents).toEqual([])
  })

  it('retrieves consents if Feature Flag on', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserConsent(), {
      // @ts-ignore
      wrapper,
      initialProps: { enable_require_applicant_consents: true },
    })

    await waitForNextUpdate()

    expect(result.current?.enabled).toEqual(true)
    expect(result.current?.consents).toEqual(applicantConsents)
  })

  it('updates consents status', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserConsent(), {
      // @ts-ignore
      wrapper,
      initialProps: { enable_require_applicant_consents: true },
    })

    await waitForNextUpdate()

    result.current?.updateConsents(true)
    expect(result.current?.consents?.every(({ granted }) => !!granted))

    result.current?.updateConsents(false)
    expect(result.current?.consents?.every(({ granted }) => !granted))
  })

  it('enable consents if network calls fail', async () => {
    getApplicantConsentsMock.mockRejectedValue(undefined)

    const { result, waitForNextUpdate } = renderHook(() => useUserConsent(), {
      // @ts-ignore
      wrapper,
      initialProps: { enable_require_applicant_consents: true },
    })

    await waitForNextUpdate()

    expect(result.current?.consents).toEqual(applicantConsents)
  })
})
