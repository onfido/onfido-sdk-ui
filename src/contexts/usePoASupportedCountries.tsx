import { h, ComponentChildren, createContext, Fragment } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { PoASupportedCountry } from '~types/api'
import { getPoASupportedCountries } from '~utils/onfidoApi'

type PoASupportedCountriesProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
}

export const PoASupportedCountriesContext = createContext<
  PoASupportedCountry[]
>([])

export const PoASupportedCountriesProvider = ({
  children,
  url,
  token,
  fallback,
}: PoASupportedCountriesProviderProps) => {
  const [countries, setCountries] = useState<PoASupportedCountry[] | undefined>(
    undefined
  )

  if (!token) {
    throw new Error('token not provided')
  }

  if (!url) {
    throw new Error('url not provided')
  }

  useEffect(() => {
    if (!url || !token) {
      return
    }

    getPoASupportedCountries(url, token)
      .then((countries) => setCountries(countries))
      .catch(() => setCountries([]))
  }, [url, token])

  if (!countries) {
    return <Fragment>{fallback}</Fragment>
  }

  return (
    <PoASupportedCountriesContext.Provider value={countries}>
      {children}
    </PoASupportedCountriesContext.Provider>
  )
}

const usePoASupportedCountries = () => {
  return useContext(PoASupportedCountriesContext)
}

export default usePoASupportedCountries
