import { getApplicantConsents, updateApplicantConsents } from '~utils/onfidoApi'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/compat'
import { ComponentChildren, createContext, Fragment, h } from 'preact'
import { ApplicantConsent, ApplicantConsentStatus } from '~types/api'
import { getPayloadFromJWT } from '~utils/jwt'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'

type ConsentProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
}

export type ConsentContextValue = {
  enabled: boolean
  consents: ApplicantConsentStatus[]
  grantConsents: () => Promise<void>
}

export const UserConsentContext = createContext<ConsentContextValue>({
  enabled: false,
  consents: [],
  grantConsents: Promise.resolve,
})

export const UserConsentProvider = ({
  children,
  url,
  token,
  fallback,
}: ConsentProviderProps) => {
  if (!token) {
    throw new Error('token not provided')
  }

  if (!url) {
    throw new Error('url not provided')
  }

  const { sdk_features } = useSdkConfigurationService()

  const applicantUUID = useMemo(() => getPayloadFromJWT(token).app, [token])

  const [consents, setConsents] = useState<
    ApplicantConsentStatus[] | undefined
  >()

  const enabled = sdk_features?.enable_applicant_consents ?? false

  const grantConsents = useCallback(() => {
    if (!consents) {
      throw new Error('no consents available')
    }

    if (!applicantUUID) {
      throw new Error('applicant UUID not provided')
    }

    const grantedConsents: ApplicantConsent[] = consents.map(({ name }) => ({
      name,
      granted: true,
    }))

    return updateApplicantConsents(applicantUUID, grantedConsents, url, token)
  }, [applicantUUID, consents, token, url])

  useEffect(() => {
    if (!enabled || !applicantUUID) {
      setConsents([])
      return
    }

    Promise.all([
      getApplicantConsents(url, token, applicantUUID),
      updateApplicantConsents(applicantUUID, undefined, url, token),
    ])
      .then(([response]) => setConsents(response))
      .catch(() => {
        throw new Error('unable to start consent process')
      })
  }, [url, token, applicantUUID, enabled])

  if (!consents) {
    return <Fragment>{fallback}</Fragment>
  }

  return (
    <UserConsentContext.Provider
      value={{
        enabled,
        consents,
        grantConsents,
      }}
    >
      {children}
    </UserConsentContext.Provider>
  )
}

const useUserConsent = () => {
  return useContext(UserConsentContext)
}

export default useUserConsent
