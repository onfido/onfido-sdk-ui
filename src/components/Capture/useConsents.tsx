import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/compat'
import { Network } from '~core/Network'

export type ConsentTemplate = {
  title: string
  template: string
}

export type ConsentData = {
  id: 'mno' | 'ssn'
  granted: boolean
} & ConsentTemplate

async function loadConsentData(endpoint: string) {
  return new Network().performHttpRequestPromise<ConsentTemplate>({
    method: 'GET',
    endpoint,
  })
}

export const useConsents = (consents: { id: 'mno' | 'ssn'; url: string }[]) => {
  const [consentsData, setConsentsData] = useState<ConsentData[]>([])
  const [consentsStatus, setConsentsStatus] = useState<
    'idle' | 'loading' | 'error' | 'done'
  >('idle')

  useEffect(() => {
    if (consentsStatus !== 'idle') {
      return
    }

    setConsentsStatus('loading')

    Promise.all(
      consents.map(async ({ id, url }) => {
        const data = await loadConsentData(url)
        return {
          ...data,
          id,
          granted: false,
        }
      })
    )
      .then((consentsData) => {
        setConsentsData(consentsData)
        setConsentsStatus('done')
      })
      .catch(() => {
        setConsentsStatus('error')
      })
  }, [consents, consentsStatus])

  const handleConsentChange = useCallback(
    (id: ConsentData['id'], granted: boolean) =>
      setConsentsData([
        ...consentsData.map((consent) => ({
          ...consent,
          granted: consent.id === id ? granted : consent.granted,
        })),
      ]),
    [consentsData]
  )

  return { consentsData, consentsStatus, handleConsentChange }
}
