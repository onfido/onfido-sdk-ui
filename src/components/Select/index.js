import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'
import { trackComponent } from '../../Tracker'
import MobileLink from '../MobileLink'

const Select = props => {
  const {
    finalStep,
    actions: { setDocumentType },
    data: { title, hint }
  } = props;
  return (
    <div className={style.wrapper}>
      <div className={`${style.methods} ${theme.step}`}>
        <h1 className={theme.title}>{title}</h1>
        <div>
          <p className={theme["mbottom-large"]}>{hint}</p>
          <DocumentSelector setDocumentType={setDocumentType} {...props} />
        </div>
        <MobileLink methods={['document', 'face']} token={props.token} finalStep={finalStep} />
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
