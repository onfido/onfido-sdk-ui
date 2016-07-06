import { h, Component } from 'preact'

export const DocumentNotFound = () => {
  return (
    <div className='onfido-upload-text onfido-upload-error'>We couldn’t detect a passport or identity card in this image. Please upload another one.</div>
  )
}

export const DocumentTitle = ({ useCapture }) => {
  const titleString = useCapture ?
    'Place your document in the rectangle' :
    'Upload a picture of your document'

  return <div className='onfido-title'>{titleString}</div>
}

export const DocumentOverlay = () => {
  return (
    <div className='onfido-document-overlay'>
      <span className='onfido-document-rectangle' />
    </div>
  )
}

export const DocumentInstructions = () => {
  return (
    <div className='onfido-capture-ui'>
      <p className='onfido-center'>Once it is detected you will be automatically directed to the next step.</p>
    </div>
  )
}
