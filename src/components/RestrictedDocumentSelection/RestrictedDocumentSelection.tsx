import { h } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

import { useLocales } from '~locales'
import { GlobalActions } from '~types/redux'

import {
  setIdDocumentIssuingCountry,
  setIdDocumentType,
} from '../ReduxAppWrapper/store/actions/globals'

import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'

import {
  CountryDropdown,
  HandleCountrySelect,
  SuggestedCountries,
} from '../CountrySelector/CountryDropdown'

import {
  DocumentList,
  HandleDocumentSelect,
} from '../DocumentSelector/DocumentList'

import { idDocumentOptions } from '../DocumentSelector/IdentityDocumentSelector'
import { generateDefaultOptions } from '../DocumentSelector'
import type { documentSelectionType } from '~types/commons'
import {
  getSupportedCountries,
  getSupportedDocumentTypes,
} from '~supported-documents'
import { StepsRouterProps } from '~types/routers'

export type RestrictedDocumentSelectionProps = {
  document_selection?: documentSelectionType[]
} & StepsRouterProps

export const RestrictedDocumentSelection = ({
  nextStep,
  document_selection,
}: RestrictedDocumentSelectionProps) => {
  const { translate, parseTranslatedTags } = useLocales()
  const dispatch = useDispatch<Dispatch<GlobalActions>>()
  const [country, setCountry] = useState('')

  const countryFilter =
    document_selection &&
    document_selection.filter((value, index, self) => {
      return (
        self.findIndex((v) => v.issuing_country === value.issuing_country) ===
        index
      )
    })

  const documentTypeFilter = useMemo(
    () =>
      document_selection &&
      document_selection.filter((value, index, self) => {
        return (
          self.findIndex(
            (v) =>
              v.document_type === value.document_type &&
              v.issuing_country === country
          ) === index
        )
      }),
    [country]
  )

  const countries = useMemo(() => getSupportedCountries(countryFilter), [])
  const documents = useMemo(() => {
    if (!country) {
      return []
    }

    const supportedDocumentTypes = getSupportedDocumentTypes(country)
    const defaultDocumentOptions = generateDefaultOptions(
      idDocumentOptions,
      translate,
      documentTypeFilter
    )

    return defaultDocumentOptions.filter(({ type }) =>
      supportedDocumentTypes.some((supportedType) => supportedType === type)
    )
  }, [country, translate])

  const handleCountrySelect: HandleCountrySelect = (selectedCountry) => {
    if (!selectedCountry) return
    dispatch(setIdDocumentIssuingCountry(selectedCountry))
    setCountry(selectedCountry.country_alpha3)
  }

  const handleDocumentSelect: HandleDocumentSelect = ({ type }) => {
    dispatch(setIdDocumentType(type))
    nextStep()
  }

  const suggestCountries: SuggestedCountries = (query = '', populateResults) =>
    populateResults(
      countries.filter((country) =>
        country.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    )

  return (
    <ScreenLayout>
      <PageTitle title={translate('doc_select.title')} />
      <div>
        <CountryDropdown
          suggestCountries={suggestCountries}
          handleCountrySelect={handleCountrySelect}
          parseTranslatedTags={parseTranslatedTags}
          translate={translate}
        />
        <DocumentList
          options={documents}
          handleDocumentSelect={handleDocumentSelect}
          parseTranslatedTags={parseTranslatedTags}
          translate={translate}
        />
      </div>
    </ScreenLayout>
  )
}
