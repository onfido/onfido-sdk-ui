import { h, Component } from 'preact'
import classNames from 'classnames'
import { events } from 'onfido-sdk-core'
import NativeListener from 'react-native-listener'

import Complete from '../Complete'
import DocumentSelector from '../DocumentSelector'

export default class Home extends Component {

  renderMethod = (method) => {
    console.log(this.props)
    const { hasDocumentCaptured, nextPage } = this.props
    const { view, complete, renderDropdown, hint } = method
    const { setDocumentType } = this.props.actions
    const classes = classNames({
      'onfido-method': true,
      'onfido-disabled': !hasDocumentCaptured,
      [`onfido-method--${view}`]: true
    })
    const iconClass = classNames({
      'onfido-icon': true,
      'onfido-icon--complete': complete,
      [`onfido-icon--${view}`]: !complete
    })
    return (
      <div className='onfido-methods'>
        <div className='onfido-header'>Verify your identity</div>
          <div className={classes}>
            <a className='onfido-method-selector' onClick={nextPage}>
              <span className={iconClass}></span>
              {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} />}
              <p className='onfido-instructions'>{hint}</p>
            </a>
          </div>
      </div>
    )
  }

  render () {
    const { hasDocumentCaptured, hasFaceCaptured, method } = this.props
    const complete = (hasDocumentCaptured && hasFaceCaptured)
    const methods = {
      'document': {
        view: 'document',
        hint: 'Take a capture of your passport or national identity card, which will be used to verify your identity.',
        title: 'Document capture',
        complete: hasDocumentCaptured,
        renderDropdown: true
      },
      'face': {
        view: 'face',
        hint: 'Take a photo of your face, which will be automatically matched with the photo from your document.',
        title: 'A photo of you',
        complete: hasFaceCaptured,
        renderDropdown: false
      }
    }
    return (
      <div className='onfido-wrapper'>
        <div className='onfido-actions'>
          <span></span>
          <a rel='modal:close' className='onfido-btn-nav onfido-btn-nav--right'>× Close</a>
        </div>
        {this.renderMethod(methods[method])}
      </div>
    )
  }
}
