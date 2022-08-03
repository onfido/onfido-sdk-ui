import { ComponentType, h } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

import { useLocales } from '~locales'
import { GlobalActions } from '~types/redux'
import { StepComponentProps } from '~types/routers'
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

import { idDocumentOptions, generateDefaultOptions } from '../DocumentSelector'

import {
  getSupportedCountries,
  getSupportedDocumentTypes,
} from '~supported-documents'

import { CountryData, documentSelectionType } from '~types/commons'
import { trackComponent } from '../../Tracker'
import { WithTrackingProps } from '~types/hocs'

export type RestrictedDocumentSelectionProps = {
  documentSelection?: documentSelectionType[]
  countryFilter?: documentSelectionType[]
} & StepComponentProps &
  WithTrackingProps

export const RestrictedDocumentSelection = trackComponent(
  ({
    nextStep,
    documentSelection,
    countryFilter,
  }: RestrictedDocumentSelectionProps) => {
    const { translate, parseTranslatedTags } = useLocales()
    const dispatch = useDispatch<Dispatch<GlobalActions>>()
    const [country, setCountry] = useState<CountryData | undefined>(undefined)

    const documentTypeFilter = useMemo(
      () =>
        documentSelection &&
        documentSelection.filter((value, index, self) => {
          return (
            self.findIndex(
              (v) =>
                v.document_type === value.document_type &&
                v.issuing_country === country?.country_alpha3
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

      const supportedDocumentTypes = getSupportedDocumentTypes(
        country.country_alpha3
      )
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
          title={translate('doc_select.title')}
          subTitle={translate('doc_select.subtitle_country')}
        />
        <div className={style.selectionContainer}>
          <label htmlFor="country-search">
            {translate('doc_select.section.header_country')}
          </label>
          <CountryDropdown
            suggestCountries={suggestCountries}
            handleCountrySelect={handleCountrySelect}
            placeholder={translate(
              'doc_select.section.input_placeholder_country'
            )}
            noResults={translate('doc_select.section.input_country_not_found')}
          />
        </div>
        {documents.length > 0 ? (
          <div className={style.selectionContainer}>
            <label>{translate('doc_select.section.header_doc_type')}</label>
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
  },
  'type_select'
) as ComponentType<StepComponentProps>
