import { h, Component } from 'preact'
import { Link } from 'preact-router'

const ActionBar = (props) => {
  const firstStep = (props.step < 2 || !props.step)
  return (
    <div className='onfido-actions onfido-actions--top'>
      {!firstStep && <Link
        href={props.prevLink}
        className='onfido-btn-nav'>
          <span>&larr;&nbsp;Back</span>
      </Link> || <span />}
      <a
        rel='modal:close'
        className='onfido-btn-nav onfido-btn-nav--right'
      >
        × Close
      </a>
    </div>
  )
}


export default ActionBar
