// @flow
import * as React from 'react'
import { h } from 'preact'
import PageTitle from '../PageTitle'
import style from './style.css'
import {
  PoADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import type { GroupType } from '../DocumentSelector/documentTypes'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
type Props = {
  country: string,
  nextStep: void => void,
  documentTypes?: Object,
  actions: Object,
} & LocalisedType

const makeDocumentSelectorOfGroup = (group: GroupType) =>
  (props: Props) => {
    const { translate, country } = props;
    const isPoA = group === 'proof_of_address'
    const DocumentSelector = isPoA ? PoADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <PageTitle
          title={translate(`document_selector.${group}.title`, {
            country: !country || country === 'GBR' ? 'UK' : '',
          })}
          subTitle={translate(`document_selector.${group}.hint`)}
        />
        <DocumentSelector { ...{ ...props, group } } />
      </div>
    )
  }

export const SelectPoADocument = trackComponent(localised(makeDocumentSelectorOfGroup('proof_of_address')), 'type_select')

export const SelectIdentityDocument = trackComponent(localised(makeDocumentSelectorOfGroup('identity')), 'type_select')
