import { h, Component } from 'preact'
import classNames from 'classnames'

import DocumentSelector from '../DocumentSelector'

export default class Home extends Component {

  renderMethod = (data) => {
    const { hasDocumentCaptured, nextPage } = this.props
    const { view, complete, renderDropdown, title, hint } = data
    const { setDocumentType } = this.props.actions
    const classes = classNames({
      [`onfido-method onfido-method--${view}`]: true,
      'onfido-disabled': !hasDocumentCaptured
    })
    return (
      <div className='onfido-methods onfido-step'>
        <h1 className='onfido-title'>{title}</h1>
        <div className={classes}>
          <p className='onfido-instructions onfido-mbottom-large'>{hint}</p>
          {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} {...this.props} />}
        </div>
      </div>
    )
  }

  render () {
    const { hasDocumentCaptured, hasFaceCaptured, method } = this.props
    const complete = (hasDocumentCaptured && hasFaceCaptured)
    const data = {
      view: 'document',
      hint: 'Select the type of document you would like to upload',
      title: 'Verify your identity',
      complete: hasDocumentCaptured,
      renderDropdown: true
    }
    return (
      <div className='onfido-wrapper'>
        {this.renderMethod(data)}
      </div>
    )
  }
}
