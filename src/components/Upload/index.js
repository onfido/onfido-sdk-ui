import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'

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
    <div className='onfido-overlay'>
      <div className='onfido-center'>
        <Spinner />
        <div className='onfido-processing'>Processing your document</div>
      </div>
    </div>
  )
}

export const Upload = ({ uploading, noDocument, handleUpload }) => {
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
