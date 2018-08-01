import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import {
  POADocumentSelector,
  IdentityDocumentSelector
} from '../DocumentSelector'
import { trackComponent } from '../../Tracker'

type Props = {
  actions: Object,
  i18n: Object,
}

const makeDocumentSelectorOfType = (type: 'proof_of_address'|'identity') =>
  (props: Props) => {
    const { actions: { setDocumentType }, i18n } = props;
    const DocumentSelector = type === 'proof_of_address' ? POADocumentSelector : IdentityDocumentSelector
    return (
      <div className={style.wrapper}>
        <Title
          title={i18n.t(`document_selector.${type}.title`)}
          subTitle={i18n.t(`document_selector.${type}.hint`)}
        />
        <div className={theme.thickWrapper}>
          <DocumentSelector setDocumentType={setDocumentType} {...props} />
        </div>
      </div>
    )
  }

export const SelectPOADocument = trackComponent(makeDocumentSelectorOfType('proof_of_address'), 'type_select')

export const SelectIdentityDocument = trackComponent(makeDocumentSelectorOfType('identity'), 'type_select')
