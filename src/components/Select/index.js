import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import {
  PoADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import { trackComponent } from '../../Tracker'

type Props = {
  actions: Object,
  i18n: Object,
}

const makeDocumentSelectorOfGroup = (group: 'proof_of_address'|'identity') =>
  (props: Props) => {
    const { actions: { setDocumentType }, i18n } = props;
    const DocumentSelector = group === 'proof_of_address' ? PoADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <Title
          title={i18n.t(`document_selector.${group}.title`)}
          subTitle={i18n.t(`document_selector.${group}.hint`)}
        />
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    )
  }

export const SelectPoADocument = trackComponent(makeDocumentSelectorOfGroup('proof_of_address'), 'type_select')

export const SelectIdentityDocument = trackComponent(makeDocumentSelectorOfGroup('identity'), 'type_select')
