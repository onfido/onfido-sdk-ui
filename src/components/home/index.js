import { h, Component } from 'preact'
import { Link } from 'preact-router'
import classNames from 'classnames'
import { events } from '../../../../onfido-sdk-core'

export default class Home {
  renderState (method, route) {
    if (method.complete) {
      return (<span class='btn btn-complete'>Complete</span>)
    } else {
      return (
        <Link href={route} className='onfido-method-selector'>
          {method.title}
        </Link>
      )
    }
  }

  renderMethod (method, index) {
    const classes = classNames({
      'onfido-method': true,
      'onfido-method--double': true,
      [`onfido-method-${method.type}`]: true
    })
    const route = `verify/${method.route}`
    return (
      <div className={classes}>
        <h1 class='onfido-step'>{index + 1}</h1>
        <p>{method.hint}</p>
        {this.renderState(method, route)}
      </div>
    )
  }

  closeModal () {
    events.emit('closeModal')
  }

  renderComplete () {
    return (
      <div className='onfido-method'>
        <h1>Complete</h1>
        <p>Everything is complete, thank you. You can now close this window.</p>
        <a className='btn' onClick={this.closeModal}>Complete</a>
      </div>
    )
  }

  render () {
    const { hasDocumentCaptured, hasFaceCaptured } = this.props
    const complete = (hasDocumentCaptured && hasFaceCaptured)
    const methods = [{
      route: 'document',
      type: 'documentCapture',
      hint: 'First, we need to capture a document via your camera or file upload.',
      title: 'Document capture',
      complete: hasDocumentCaptured
    },{
      route: 'face',
      type: 'faceCapture',
      hint: 'Next, we need you to take a photo of your face to match with the document.',
      title: 'Face capture',
      complete: hasFaceCaptured
    }]
    return (
      <div className='onfido-methods'>
        <a rel='modal:close' className='onfido-close'>× Close</a>
        {complete && this.renderComplete() || methods.map(::this.renderMethod)}
      </div>
    )
  }
}
