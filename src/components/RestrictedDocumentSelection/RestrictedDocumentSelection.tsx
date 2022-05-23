import { h } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

import { useLocales } from '~locales'
import { GlobalActions } from '~types/redux'
import { StepsRouterProps } from '~types/routers'
import style from './RestrictedDocumentSelection.scss'
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

import {
  getSupportedCountries,
  getSupportedDocumentTypes,
} from '~supported-documents'
import { CountryData } from '~types/commons'

export type RestrictedDocumentSelectionProps = StepsRouterProps

export const RestrictedDocumentSelection = ({
  nextStep,
}: RestrictedDocumentSelectionProps) => {
  const { translate, parseTranslatedTags } = useLocales()
  const dispatch = useDispatch<Dispatch<GlobalActions>>()

  const [country, setCountry] = useState<CountryData | undefined>(undefined)
  const countries = useMemo(() => getSupportedCountries(), [])
  const documents = useMemo(() => {
    if (!country) {
      return []
    }

    const supportedDocumentTypes = getSupportedDocumentTypes(
      country.country_alpha3
    )
    const defaultDocumentOptions = generateDefaultOptions(
      idDocumentOptions,
      translate
    )

    return defaultDocumentOptions.filter(({ type }) =>
      supportedDocumentTypes.some((supportedType) => supportedType === type)
    )
  }, [country, translate])

  const handleCountrySelect: HandleCountrySelect = (selectedCountry) => {
    if (!selectedCountry) {
      return
    }
    dispatch(setIdDocumentIssuingCountry(selectedCountry))
    setCountry(selectedCountry)
  }

  const handleDocumentSelect: HandleDocumentSelect = ({ type }) => {
    dispatch(setIdDocumentType(type))
    nextStep()
  }

  const suggestCountries: SuggestedCountries = (
    query = '',
    populateResults
  ) => {
    if (country && query !== country.name) {
      setCountry(undefined)
    }

    populateResults(
      countries.filter((country) =>
        country.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    )
  }

  return (
    <ScreenLayout>
      <PageTitle
        title={translate('restricted_document_selection.title')}
        subTitle={translate('restricted_document_selection.subtitle')}
      />
      <div className={style.selectionContainer}>
        <label htmlFor="country-search">
          {translate('restricted_document_selection.country')}
        </label>
        <CountryDropdown
          suggestCountries={suggestCountries}
          handleCountrySelect={handleCountrySelect}
          placeholder={translate(
            'restricted_document_selection.country_placeholder'
          )}
          noResults={translate(
            'restricted_document_selection.country.country_not_found'
          )}
        />
      </div>
      {documents.length > 0 ? (
        <div className={style.selectionContainer}>
          <label>{translate('restricted_document_selection.document')}</label>
          <DocumentList
            options={documents}
            handleDocumentSelect={handleDocumentSelect}
            parseTranslatedTags={parseTranslatedTags}
            translate={translate}
          />
        </div>
      ) : undefined}
    </ScreenLayout>
  )
}
