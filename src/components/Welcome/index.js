import { h, Component } from 'preact'
import { Link } from 'preact-router'
import ActionBar from '../ActionBar'

const Welcome = (props) => {

  return (
    <div>
      <ActionBar {...props} />
      <div className='onfido-step'>
        <h1 className='onfido-title'>Verify your identity</h1>
        <p>To open a bank account we will need to verify your identity. Please have your Passport, Identity Card or Drivers License ready.</p>
        <Link
          href={props.nextLink}
          className='onfido-btn onfido-btn-primary'
        >
          Let’s go
        </Link>
      </div>
    </div>

  )
}

export default Welcome
