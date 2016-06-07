import { h, Component } from 'preact'

export const FaceInstructions = ({ handeClick }) => {
  return (
    <div className='onfido-face-overlay'>
      <span className='onfido-face-circle' />
      <div className='onfido-capture-ui'>
        <p>We need to take a capture of your face to match with your document</p>
        <button id='onfido-capture' className='onfido-btn onfido-btn-primary onfido-btn-capture' onClick={handeClick}>
          Take photo
        </button>
      </div>
    </div>

  )
}
