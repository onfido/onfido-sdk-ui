import { h, Component } from 'preact'

const CameraNavigation = ({ transition }) => {
  return (
    <div class='onfido-actions'>
      <a className='onfido-btn-nav' onClick={transition.bind(this, false, 'home')}>
        <span>&larr;&nbsp;Back</span>
      </a>
      <a rel='modal:close' className='onfido-btn-nav'>
        <span>×&nbsp;Close</span>
      </a>
    </div>
  )
}

export default CameraNavigation
