import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Welcome = (props) => (
  <div className='onfido-wrapper'>
    <div class='onfido-center'>
      <h1>Welcome</h1>
      <p>To open a bank account we will need to verify your identity. Please have your Passport, Identity Card or Drivers License ready.</p>
      <Link
        href="/step/1"
        className='onfido-btn onfido-btn-primary'
      >
        Step 1
      </Link>
    </div>
  </div>
)

export default Welcome
