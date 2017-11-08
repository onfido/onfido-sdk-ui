import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'
import { trackComponent } from '../../Tracker'

const Select = props => {
  const {
    actions: { setDocumentType },
    data: { title, hint }
  } = props;
  return (
    <div className={style.wrapper}>
      <h1 className={theme.title}>{title}</h1>
      <div className={theme.textWrapper}>
        <p className={theme["mbottom-large"]}>{hint}</p>
        <DocumentSelector setDocumentType={setDocumentType} {...props} />
      </div>
    </div>
  )
}

Select.defaultProps = {
  data: {
    hint: 'Select the type of document you would like to upload',
    title: 'Verify your identity'
  }
};

export default trackComponent(Select, 'type_select')
