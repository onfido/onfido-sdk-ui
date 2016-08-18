import { h, Component } from 'preact'
import classNames from 'classnames'
import theme from '../../style/refactor.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'

const Home = (props) => {
  const {
    documentCaptured,
    nextPage,
    actions: { setDocumentType },
    data: { renderDropdown, title, hint }
  } = props;

  return (
    <div className={style.wrapper}>
      <div className={`${style.methods} ${theme.step}`}>
        <h1 className={theme.title}>{title}</h1>
        <div>
          <p className={theme["mbottom-large"]}>{hint}</p>
          {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} {...props} />}
        </div>
      </div>
    </div>
  )
}


Home.defaultProps = {
  data: {
    hint: 'Select the type of document you would like to upload',
    title: 'Verify your identity',
    renderDropdown: true
  }
};

export default Home;
