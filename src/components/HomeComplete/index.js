import { h, Component } from 'preact'

const HomeComplete = ({ handeClick }) => {
  return (
    <div>
      <div className='onfido-header'>Complete</div>
      <a className='onfido-method-selector' onClick={handeClick}>
        <span className='onfido-icon onfido-icon--complete'></span>
        <p className='onfido-complete-text'>
          Everything is complete, thank you.<br/>
          You can now close this window.
        </p>
      </a>
    </div>
  )
}

export default HomeComplete
