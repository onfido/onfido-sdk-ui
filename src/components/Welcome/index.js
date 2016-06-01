import { h, Component } from 'preact'

const Welcome = (props) => {
  const { changeView } = props
  return (
    <div className='onfido-wrapper'>
      <div class='onfido-center'>
        <h1>Welcome</h1>
        <p>To open a bank account we will need to verify your identity. Please have your Passport, Identity Card or Drivers License ready.</p>
        <button
          onClick={changeView}
          className='onfido-btn onfido-btn-primary'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Welcome
