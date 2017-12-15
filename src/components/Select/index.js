import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'
import { trackComponent } from '../../Tracker'

const Select = props => {
  const { actions: { setDocumentType }, i18n } = props;
  return (
    <div className={style.wrapper}>
      <Title title={i18n.t('document_selector.title')} subTitle={i18n.t('document_selector.hint')} />
      <div className={theme.thickWrapper}>
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    </div>
  )
}

export default trackComponent(Select, 'type_select')
