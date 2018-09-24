// @flow
import * as React from 'react'
import { h } from 'preact'
import Title from '../Title'
import style from './style.css'
import {
  PoADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import type { GroupType } from '../DocumentSelector/documentTypes'
import { trackComponent } from '../../Tracker'

type Props = {
  country: string,
  documentTypes?: Object,
  actions: Object,
  i18n: Object,
}

const makeDocumentSelectorOfGroup = (group: GroupType) =>
  (props: Props) => {
    const { actions: { setDocumentType }, i18n, country } = props;
    const DocumentSelector = group === 'proof_of_address' ? PoADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <Title
          title={i18n.t(`document_selector.${group}.title`, {
            country: !country || country === 'GBR' ? 'UK' : '',
          })}
          subTitle={i18n.t(`document_selector.${group}.hint`)}
        />
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    )
  }

export const SelectPoADocument = trackComponent(makeDocumentSelectorOfGroup('proof_of_address'), 'type_select')

export const SelectIdentityDocument = trackComponent(makeDocumentSelectorOfGroup('identity'), 'type_select')
