import { h, Component } from 'preact'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'
import { impurify } from '../utils'

const Home = props => {
  const {
    nextPage,
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
      </div>
    </div>
  )
}

Home.defaultProps = {
  data: {
    hint: 'Select the type of document you would like to upload',
    title: 'Verify your identity'
  }
};

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Capture will not have componentWillUnmount called
export default impurify(Home)
