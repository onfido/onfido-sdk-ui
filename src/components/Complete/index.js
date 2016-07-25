import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Complete = ({message, submessage}) => (
  <div>
    <div className='onfido-step'>
      <span className='onfido-icon onfido-icon--complete'></span>
      <h1 className='onfido-title onfido-center'>{message}</h1>
      <p className='onfido-mbottom-large onfido-center'>{submessage}</p>
    </div>
  </div>
)

Complete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default Complete
