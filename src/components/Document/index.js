import { h, Component } from 'preact'

export const DocumentNotFound = () => {
  return (
    <div className='onfido-upload-text onfido-upload-error'>We couldn’t detect a passport or identity card in this image. Please upload another one.</div>
  )
}

export const DocumentInstructions = () => {
  return (
    <div className='onfido-capture-ui'>
      <p className='onfido-center'>Hold your document up to the camera. It will be detected automatically.</p>
    </div>
  )
}
