import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Welcome = (props) => {

  return (
    <div>
      <div className='onfido-step'>
        <h1 className='onfido-title'>Open your new bank account</h1>
        <div class='onfido-mtop-large onfido-mbottom-large'>
          <p>To open a bank account, we will need to verify your identity.</p>
          <p>It will only take a couple of minutes.</p>
        </div>
        <Link
          href={props.nextLink}
          className='onfido-btn onfido-btn-primary'
        >
          Verify Identity
        </Link>
      </div>
    </div>

  )
}

export default Welcome
