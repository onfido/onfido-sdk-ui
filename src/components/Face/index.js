import { h, Component } from 'preact'

export const FaceTitle = () => {
  return <div className='onfido-title'>Place your face in the circle</div>
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
