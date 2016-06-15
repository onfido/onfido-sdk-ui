import { h, Component } from 'preact'

export const FaceTitle = ({ useCapture }) => {
  const titleString = useCapture ?
    'Place your face in the circle' :
    'Upload a picture of your face'

  return <div className='onfido-title'>{titleString}</div>
}

export const FaceOverlay = () => {
  return (
    <div className='onfido-face-overlay'>
      <span className='onfido-face-circle' />
    </div>
  )
}

export const FaceInstructions = ({ handeClick }) => {
  return (
    <div className='onfido-face-instructions'>
      <button
        id='onfido-capture'
        className='onfido-btn onfido-btn-primary onfido-btn-capture onfido-btn-centered'
        onClick={handeClick}
      >
        Take photo
      </button>
    </div>
  )
}
