import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'
import { trackComponent } from '../../Tracker'

const Select = props => {
  const {
    actions: { setDocumentType },
    data: { title, hint },
    types
  } = props;
  return (
    <div className={style.wrapper}>
      <div className={`${style.methods} ${theme.step}`}>
        <h1 className={theme.title}>{title}</h1>
        <div className={style.select}>
          <p className={theme["mbottom-large"]}>{hint}</p>
          <DocumentSelector
            setDocumentType={setDocumentType} {...props}
            types={types}
          />
        </div>
      </div>
    </div>
  )
}

Select.defaultProps = {
  data: {
    hint: 'Select the type of document you would like to upload',
    title: 'Verify your identity'
  },
  types: []
};

export default trackComponent(Select, 'type_select')
