import { Component, h } from 'preact'
import { kebabCase } from '~utils/string'
import { isEmpty } from '~utils/object'
import { StepComponentBaseProps } from '~types/routers'
import { TranslateCallback } from '~types/locales'
import PageTitle from '../PageTitle'
import { LocaleContext } from '~locales'
import { DocumentTypeConfig, DocumentTypes, PoaTypes } from '~types/steps'
import { PoASupportedCountry } from '~types/api'
import {
  DocumentList,
  DocumentOptions,
  DocumentOptionsType,
} from './DocumentList'
import type { documentSelectionType } from '~types/commons'

const always = () => true

export type Props = {
  className?: string
  documentTypes: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  country?: string
  type: DocumentTypes | PoaTypes
  autoFocusOnInitialScreenTitle?: boolean
  countryList?: PoASupportedCountry[]
} & StepComponentBaseProps

// The 'type' value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
export abstract class DocumentSelectorBase extends Component<Props> {
  private defaultOptions: DocumentOptionsType[] | undefined = undefined
  protected country: string | undefined = undefined

  private getOptions = (
    translate: (key: string, options?: Record<string, unknown>) => string
  ) => {
    const { documentTypes, country } = this.props
    const countryCode = country || this.country || 'GBR'

    if (!this.defaultOptions) {
      this.defaultOptions = generateDefaultOptions(
        this.getDefaultOptions(),
        translate
      )
    }

    const defaultDocOptions = this.defaultOptions.filter(
      ({ checkAvailableInCountry = always }) =>
        checkAvailableInCountry(countryCode)
    )
    const checkAvailableType = isEmpty(documentTypes)
      ? always
      : (type: DocumentOptionsType) => documentTypes[type.type]
    const options = defaultDocOptions.filter(checkAvailableType)

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleDocumentSelect = (option: DocumentOptionsType) => {
    this.handleDocumentTypeSelected(option)
    this.props.nextStep()
  }

  abstract getDefaultOptions(): DocumentOptions

  abstract handleDocumentTypeSelected(option: DocumentOptionsType): void

  abstract titleTranslationKey(): string

  abstract subTitleTranslationKey(): string

  abstract pageId(): string

  protected shouldAutoFocus(): boolean {
    return false
  }

  render() {
    const { country } = this.props
    const countryCode = country || this.country || 'GBR'

    return (
      <LocaleContext.Consumer>
        {(injectedProps) => {
          if (injectedProps == null) {
            throw new Error(`LocaleContext hasn't been initialized!`)
          }

          const { translate } = injectedProps

          const title = translate(this.titleTranslationKey(), {
            country: !countryCode || countryCode === 'GBR' ? 'UK' : '',
          })

          const subTitle = translate(this.subTitleTranslationKey())
          const options = this.getOptions(translate)

          return (
            <div data-page-id={this.pageId()}>
              <PageTitle
                title={title}
                subTitle={subTitle}
                shouldAutoFocus={this.shouldAutoFocus()}
              />
              <DocumentList
                {...injectedProps}
                {...this.props}
                handleDocumentSelect={this.handleDocumentSelect}
                options={options}
              />
            </div>
          )
        }}
      </LocaleContext.Consumer>
    )
  }
}

export function generateDefaultOptions(
  documentOptions: DocumentOptions,
  translate: TranslateCallback,
  filterList?: documentSelectionType[]
): DocumentOptionsType[] {
  const options = Object.entries(documentOptions).map(
    ([type, configuration]) => {
      const {
        icon = `icon-${kebabCase(type)}`,
        labelKey,
        detailKey,
        warningKey,
        eStatementsKey,
        checkAvailableInCountry,
      } = configuration

      return {
        icon,
        type: type as DocumentTypes & PoaTypes,
        label: translate(labelKey),
        detail: detailKey ? translate(detailKey) : '',
        warning: warningKey ? translate(warningKey) : '',
        eStatements: eStatementsKey ? translate(eStatementsKey) : '',
        checkAvailableInCountry,
      }
    }
  )

  const filteredDocumentOptions = filterList
    ? options.filter((el) => {
        return filterList.some((f) => {
          return f.document_type === el.type
        })
      })
    : options

  return filteredDocumentOptions
}

export const idDocumentOptions: DocumentOptions = {
  passport: {
    labelKey: 'doc_select.button_passport',
    detailKey: 'doc_select.button_passport_detail',
  },
  driving_licence: {
    labelKey: 'doc_select.button_license',
    detailKey: 'doc_select.button_license_detail',
  },
  national_identity_card: {
    labelKey: 'doc_select.button_id',
    detailKey: 'doc_select.button_id_detail',
  },
  residence_permit: {
    labelKey: 'doc_select.button_permit',
    detailKey: 'doc_select.button_permit_detail',
  },
}
