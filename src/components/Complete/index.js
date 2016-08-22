import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../../style/refactor.css'

const Complete = ({message, submessage}) => (
  <div>
    <div className='onfido-step'>
      <span className='onfido-icon onfido-icon--complete'></span>
      <h1 className={`onfido-title ${theme.center}`}>{message}</h1>
      <p className={`onfido-mbottom-large ${theme.center}`}>{submessage}</p>
    </div>
  </div>
)

Complete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default Complete
