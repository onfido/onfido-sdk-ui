import { h, Component } from 'preact'
import ActionBar from '../ActionBar'

const Complete = (props) => (
  <div>
    <ActionBar {...props} />
    <div className='onfido-step'>
      <h1 className='onfido-title onfido-center'>Complete</h1>
      <span className='onfido-icon onfido-icon--complete'></span>
      <p className='onfido-center'>
        Everything is complete, thank you.<br/>
        You can now close this window.
      </p>
    </div>
  </div>
)

export default Complete
