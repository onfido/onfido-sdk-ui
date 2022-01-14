import { h } from 'preact'
import { localised } from '~locales'
import { WithLocalisedProps } from '~types/hocs'
import { StepComponentFaceProps } from '~types/routers'
import { trackComponent } from '../../Tracker'
import {
  IdentityDocumentSelector,
  PoADocumentSelector,
} from '../DocumentSelector'
import PageTitle from '../PageTitle'

type DocumentSelectorByGroupProps = { country: string } & WithLocalisedProps &
  StepComponentFaceProps

const makeDocumentSelectorOfGroup = (group: string) => {
  const DocumentSelectorByGroup = (props: DocumentSelectorByGroupProps) => {
    const { translate, country, steps, autoFocusOnInitialScreenTitle } = props
    const isFirstScreen = steps[0].type === 'document'
    const isPoA = group === 'proof_of_address'
    const DocumentSelector = isPoA
      ? PoADocumentSelector
      : IdentityDocumentSelector

    return (
      <div>
        <PageTitle
          title={translate(
            isPoA ? 'doc_select.title_poa' : 'doc_select.title',
            {
              country: !country || country === 'GBR' ? 'UK' : '',
            }
          )}
          subTitle={translate(
            isPoA ? 'doc_select.subtitle_poa' : 'doc_select.subtitle'
          )}
          shouldAutoFocus={
            (isFirstScreen && autoFocusOnInitialScreenTitle) || !isFirstScreen
          }
        />
        <DocumentSelector {...{ ...props, group }} />
      </div>
    )
  }

  return DocumentSelectorByGroup
}

export const SelectPoADocument = trackComponent(
  localised(makeDocumentSelectorOfGroup('proof_of_address')),
  'type_select'
)

export const SelectIdentityDocument = trackComponent(
  localised(makeDocumentSelectorOfGroup('identity')),
  'type_select'
)
