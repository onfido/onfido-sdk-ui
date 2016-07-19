import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Welcome = ({title, descriptions, nextButton, nextLink}) => {

  return (
    <div>
      <div className='onfido-step'>
        <h1 className='onfido-title'>{title}</h1>
        <div class='onfido-mtop-large onfido-mbottom-large'>
          {descriptions.map(description => <p>{description}</p>)}
        </div>
        <Link
          href={nextLink}
          className='onfido-btn onfido-btn-centered onfido-btn-primary'>
          {nextButton}
        </Link>
      </div>
    </div>

  )
}

Welcome.defaultProps =  {
  title: 'Open your new bank account',
  descriptions: [
    'To open a bank account, we will need to verify your identity.',
    'It will only take a couple of minutes.'
  ],
  nextButton:'Verify Identity'
}

export default Welcome
