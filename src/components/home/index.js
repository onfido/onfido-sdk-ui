import { h, Component } from 'preact'
import classNames from 'classnames'
import { events } from 'onfido-sdk-core'

import HomeComplete from '../HomeComplete'

export default class Home {

  renderMethod (method, index) {
    const { transition } = this.props
    const classes = classNames({
      'onfido-method': true,
      'onfido-method--double': true,
      [`onfido-method-${method.type}`]: true
    })
    const iconClass = classNames({
      'onfido-icon': true,
      'onfido-icon--complete': method.complete,
      [`onfido-icon--${method.type}`]: !method.complete
    })
    const route = `verify/${method.route}`
    return (
      <div className={classes}>
        <a onClick={transition.bind(this, true, method.route)} className='onfido-method-selector'>
          <span className={iconClass}></span>
          <p className='onfido-instructions'>{method.hint}</p>
          {/*this.renderState(method, route)*/}
        </a>
      </div>
    )
  }

  closeModal () {
    events.emit('closeModal')
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
      complete: hasDocumentCaptured
    },{
      route: 'face',
      type: 'faceCapture',
      hint: 'Take a photo of your face, which will be automatically matched with the photo from your document.',
      title: 'A photo of you',
      complete: hasFaceCaptured
    }]
    return (
      <div className='onfido-wrapper'>
        <div className='onfido-actions'>
          <span></span>
          <a rel='modal:close' className='onfido-btn-nav onfido-btn-nav--right'>× Close</a>
        </div>
        {complete && <HomeComplete handleClick={this.closeModal} /> || this.renderMethods(methods)}
      </div>
    )
  }
}
