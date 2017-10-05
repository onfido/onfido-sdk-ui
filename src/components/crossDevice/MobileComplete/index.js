import { h } from 'preact'

import { trackComponent } from '../../../Tracker'


const MobileComplete = () => {
  return (
    <div>Complete!</div>
  )
}

export default trackComponent(MobileComplete, 'mobile_complete')
