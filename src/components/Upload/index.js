import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'
import Previews from '../Previews'

export const UploadInstructions = () => {
  return (
    <div className='onfido-upload'>
      <span className='onfido-icon onfido-icon--upload'></span>
      <p className='onfido-upload-text'>Take a photo with your camera or upload one from your library.</p>
    </div>
  )
}

export const UploadProcessing = () => {
  return (
    <div className='onfido-center'>
      <Spinner />
      <div className='onfido-processing'>Processing your document</div>
    </div>
  )
}

const Uploader = (props) => {
  const { handleUpload, uploading, noDocument } = props
  return (
    <Dropzone
      onDrop={handleUpload}
      multiple={false}
      className='onfido-dropzone'
    >
      {uploading && <UploadProcessing /> || <UploadInstructions />}
      {(!uploading && noDocument) && <DocumentNotFound />}
    </Dropzone>
  )
}

const renderUploader = (props, captured) => {
  return ( captured && <Previews {...props} /> || <Uploader {...props} /> )
}

export const Upload = (props) => {
  const { hasDocumentCaptured, hasFaceCaptured, method } = props
  const methods = {
    'document': () => renderUploader(props, hasDocumentCaptured),
    'face': () => renderUploader(props, hasFaceCaptured),
    'home': () => null
  }
  return (methods[method] || methods['home'])()
}
