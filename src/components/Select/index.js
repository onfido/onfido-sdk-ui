// @flow
import * as React from 'react'
import { h } from 'preact'
import Title from '../Title'
import style from './style.css'
import {
  PoADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import { trackComponent } from '../../Tracker'
import {localised} from '../../locales'

type Props = {
  nextStep: void => void,
  documentTypes?: Object,
  actions: Object,
}

const makeDocumentSelectorOfGroup = (group: 'proof_of_address' | 'identity') =>
  (props: Props) => {
    const { actions: { setDocumentType }, t } = props;
    const DocumentSelector = group === 'proof_of_address' ? PoADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <Title
          title={t(`document_selector.${group}.title`)}
          subTitle={t(`document_selector.${group}.hint`)}
        />
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    )
  }

export const SelectPoADocument = trackComponent(localised(makeDocumentSelectorOfGroup('proof_of_address')), 'type_select')

export const SelectIdentityDocument = trackComponent(localised(makeDocumentSelectorOfGroup('identity')), 'type_select')
