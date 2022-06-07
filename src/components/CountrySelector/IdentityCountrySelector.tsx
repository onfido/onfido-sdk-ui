import { h } from 'preact'
import { localised } from '~locales'
import { getSupportedCountriesForDocument } from '~supported-documents'
import { appendToTracking } from 'Tracker'
import theme from 'components/Theme/style.scss'
import classNames from 'classnames'

import type { CountryData } from '~types/commons'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { DocumentTypes, PoaTypes } from '~types/steps'

import style from './style.scss'
import { parseTags, preventDefaultOnClick } from '~utils'
import IconAlert from './assets/IconAlert'

export type DocProps = {
  documentType: string
  idDocumentIssuingCountry: CountryData
} & Props &
  WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class IdentityCountrySelection extends CountrySelectionBase {
  trackScreen = () => {
    this.props.trackScreen(undefined, {
      document_type: this.props.documentType,
    })
  }
  hasChanges = (prevProps: Props): boolean | undefined => {
    return (
      prevProps.documentType &&
      this.props.documentType !== prevProps.documentType
    )
  }

  getDocumentProps = (): DocumentProps => {
    const { documentType, idDocumentIssuingCountry } = this.props

    return {
      documentType,
      documentCountry: idDocumentIssuingCountry,
    }
  }

  updateCountry = (selectedCountry: CountryData): void => {
    this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
  }

  resetCountry = () => {
    this.props.actions.resetIdDocumentIssuingCountry()
  }

  getSupportedCountries = (
    documentType: Optional<PoaTypes | DocumentTypes>
  ): CountryData[] => {
    return getSupportedCountriesForDocument(documentType as DocumentTypes)
  }

  renderNoResultsMessage = (): h.JSX.Element => {
    const noResultsErrorCopy = this.props.translate(
      'country_select.alert.another_doc'
    )

    return (
      <div className={style.errorContainer}>
        <IconAlert className={style.icon} />
        <span className={style.fallbackText}>
          {parseTags(noResultsErrorCopy, ({ text }) => (
            <a
              href="#"
              className={classNames(theme.link, style.fallbackLink)}
              onClick={preventDefaultOnClick(
                this.trackChooseAnotherDocumentTypeClick
              )}
            >
              {text}
            </a>
          ))}
        </span>
      </div>
    )
  }
}

export default appendToTracking(
  localised(IdentityCountrySelection),
  'country_select'
)
