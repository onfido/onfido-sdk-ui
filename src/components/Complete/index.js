import { h, Component } from 'preact'
import ActionBar from '../ActionBar'
import { Link } from 'preact-router'

const Complete = (props) => (
  <div>
    <ActionBar {...props} />
    <div className='onfido-step'>
      <span className='onfido-icon onfido-icon--complete'></span>
      <h1 className='onfido-title onfido-center'>Verification complete</h1>
      <p className='onfido-mbottom-large onfido-center'>Thank you.</p>

      <div
        onClick={() => document.location = document.location}
        className='onfido-btn onfido-btn-primary'
      >
        Finish
      </div>
    </div>
  </div>
)

export default Complete
