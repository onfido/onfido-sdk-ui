import { h, Component } from 'preact'

const HomeComplete = () => {
  return (
    <div className='onfido-complete'>
      <div className='onfido-header'>Complete</div>
      <div className='onfido-method-selector'>
        <span className='onfido-icon onfido-icon--complete'></span>
        <p className='onfido-complete-text'>
          Everything is complete, thank you.<br/>
          You can now close this window.
        </p>
      </div>
    </div>
  )
}

export default HomeComplete
