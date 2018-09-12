// @flow
import * as React from 'react'
import { h } from 'preact'
import Title from '../Title'
import style from './style.css'
import {
  PoADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import type { groupType } from '../DocumentSelector'
import { trackComponent } from '../../Tracker'
import {localised} from '../../locales'

type Props = {
  nextStep: void => void,
  documentTypes?: Object,
  actions: Object,
}

const makeDocumentSelectorOfGroup = (group: groupType) =>
  (props: Props) => {
    const { actions: { setDocumentType }, translate } = props;
    const DocumentSelector = group === 'proof_of_address' ? PoADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <Title
          title={translate(`document_selector.${group}.title`)}
          subTitle={translate(`document_selector.${group}.hint`)}
        />
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    )
  }

export const SelectPoADocument = trackComponent(localised(makeDocumentSelectorOfGroup('proof_of_address')), 'type_select')

export const SelectIdentityDocument = trackComponent(localised(makeDocumentSelectorOfGroup('identity')), 'type_select')
