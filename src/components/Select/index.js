import { h, Component } from 'preact'
import classNames from 'classnames'

import ActionBar from '../ActionBar'
import DocumentSelector from '../DocumentSelector'

export default class Home extends Component {

  renderMethod = (data) => {
    const { hasDocumentCaptured, nextPage } = this.props
    const { view, complete, renderDropdown, hint } = data
    const { setDocumentType } = this.props.actions
    const classes = classNames({
      [`onfido-method onfido-method--${view}`]: true,
      'onfido-disabled': !hasDocumentCaptured
    })
    const iconClass = classNames({
      'onfido-icon': true,
      'onfido-icon--complete': complete,
      [`onfido-icon--${view}`]: !complete
    })
    return (
      <div className='onfido-methods onfido-step'>
        <h1 className='onfido-title'>Choose document type</h1>
        <div className={classes}>
          <span className={iconClass}></span>
          {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} {...this.props} />}
          <p className='onfido-instructions'>{hint}</p>
        </div>
      </div>
    )
  }

  render () {
    const { hasDocumentCaptured, hasFaceCaptured, method } = this.props
    const complete = (hasDocumentCaptured && hasFaceCaptured)
    const data = {
      view: 'document',
      hint: 'Take a capture of your passport or national identity card, which will be used to verify your identity.',
      title: 'Document capture',
      complete: hasDocumentCaptured,
      renderDropdown: true
    }
    return (
      <div className='onfido-wrapper'>
        <ActionBar {...this.props} />
        {this.renderMethod(data)}
      </div>
    )
  }
}
