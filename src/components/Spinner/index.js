import { h, Component } from 'preact'

const Spinner = () => {
  return (
    <div className="loader">
      <div className="loader-inner ball-scale-ripple-multiple">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner
