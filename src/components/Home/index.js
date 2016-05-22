import { h, Component } from 'preact'
import classNames from 'classnames'
import { events } from 'onfido-sdk-core'
import NativeListener from 'react-native-listener'

import HomeComplete from '../HomeComplete'
import DocumentSelector from '../DocumentSelector'

export default class Home {

  handleClick = (method) => {
    const { changeView, documentType } = this.props
    const methods = {
      'document': () => {
        if (documentType) {
          changeView(true, method)
        }
      },
      'face': () => changeView(true, method),
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  renderMethod (method, index) {
    const { type, route, complete, renderDropdown, hint } = method
    const { setDocumentType } = this.props.actions
    const classes = classNames({
      'onfido-method': true,
      'onfido-method--double': true,
      [`onfido-method-${type}`]: true
    })
    const iconClass = classNames({
      'onfido-icon': true,
      'onfido-icon--complete': complete,
      [`onfido-icon--${type}`]: !complete
    })
    return (
      <div className={classes}>
        <a
          onClick={this.handleClick.bind(this, route)}
          className='onfido-method-selector'
        >
          <span className={iconClass}></span>
          {renderDropdown && <DocumentSelector setDocumentType={setDocumentType} />}
          <p className='onfido-instructions'>{hint}</p>
        </a>
      </div>
    )
  }

  renderMethods (methods) {
    return (
      <div>
        <div className='onfido-header'>Verify your identity</div>
        <div className='onfido-methods'>
          {methods.map(::this.renderMethod)}
        </div>
      </div>
    )
  }

  render () {
    const { hasDocumentCaptured, hasFaceCaptured } = this.props
    const complete = (hasDocumentCaptured && hasFaceCaptured)
    const methods = [{
      route: 'document',
      type: 'documentCapture',
      hint: 'Take a capture of your passport or national identity card, which will be used to verify your identity.',
      title: 'Document capture',
      complete: hasDocumentCaptured,
      renderDropdown: true
    },{
      route: 'face',
      type: 'faceCapture',
      hint: 'Take a photo of your face, which will be automatically matched with the photo from your document.',
      title: 'A photo of you',
      complete: hasFaceCaptured,
      renderDropdown: false
    }]
    return (
      <div className='onfido-wrapper'>
        <div className='onfido-actions'>
          <span></span>
          <a rel='modal:close' className='onfido-btn-nav onfido-btn-nav--right'>× Close</a>
        </div>
        {complete && <HomeComplete handleClick={() => events.emit('closeModal')} /> || this.renderMethods(methods)}
      </div>
    )
  }
}
