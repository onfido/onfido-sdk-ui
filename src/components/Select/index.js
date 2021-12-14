import { h } from 'preact'
import PageTitle from '../PageTitle'
import {
  PoADocumentSelector,
  IdentityDocumentSelector,
} from '../DocumentSelector'
// import type { GroupType } from '../DocumentSelector/documentTypes'
import { trackComponent } from '../../Tracker'
import { localised /*, type LocalisedType */ } from '~locales'

/* type Props = {
  country: string,
  nextStep: (void) => void,
  documentTypes?: Object,
  actions: Object,
} & LocalisedType */

const makeDocumentSelectorOfGroup = (group) => {
  const DocumentSelectorByGroup = (props) => {
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
          shouldAutoFocus={isFirstScreen && autoFocusOnInitialScreenTitle}
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
