// @flow
import { h } from 'preact'
import PageTitle from '../PageTitle'
import {
  PoADocumentSelector,
  IdentityDocumentSelector,
} from '../DocumentSelector'
import type { GroupType } from '../DocumentSelector/documentTypes'
import { trackComponent } from '../../Tracker'
import { localised, type LocalisedType } from '../../locales'
import style from './style.scss'

type Props = {
  country: string,
  nextStep: (void) => void,
  documentTypes?: Object,
  actions: Object,
} & LocalisedType

const makeDocumentSelectorOfGroup = (group: GroupType) => {
  const DocumentSelectorByGroup = (props: Props) => {
    const { translate, country } = props
    const isPoA = group === 'proof_of_address'
    const DocumentSelector = isPoA
      ? PoADocumentSelector
      : IdentityDocumentSelector

    return (
      <div className={style.wrapper}>
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
