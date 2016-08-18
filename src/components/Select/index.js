import { h, Component } from 'preact'
import classNames from 'classnames'
import theme from '../../style/refactor.css'
import style from './style.css'
import DocumentSelector from '../DocumentSelector'

export default class Home extends Component {

  renderMethod = (data) => {
    const {
      documentCaptured,
      nextPage,
      actions: { setDocumentType }
    } = this.props
    const { view, complete, renderDropdown, title, hint } = data
    const classes = classNames({
      [`onfido-method onfido-method--${view}`]: true,
      'onfido-disabled': !documentCaptured
    })
    return (
      <div className={`${style.methods} ${theme.step}`}>
        <h1 className={theme.title}>{title}</h1>
        <div className={classes}>
          <p className={theme["mbottom-large"]}>{hint}</p>
          {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} {...this.props} />}
        </div>
      </div>
    )
  }

  render () {
    const { documentCaptured, faceCaptured, method } = this.props
    const complete = (documentCaptured && faceCaptured)
    const data = {
      view: 'document',
      hint: 'Select the type of document you would like to upload',
      title: 'Verify your identity',
      complete: documentCaptured,
      renderDropdown: true
    }
    return (
      <div className='onfido-wrapper'>
        {this.renderMethod(data)}
      </div>
    )
  }
}
