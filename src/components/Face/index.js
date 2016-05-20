import { h, Component } from 'preact'

export const FaceInstructions = ({ handeClick }) => {
  return (
    <div className='onfido-capture-ui'>
      <button id='onfido-capture' className='onfido-btn onfido-btn-primary onfido-btn-capture' onClick={handeClick}>
        Take photo
      </button>
    </div>
  )
}
