import { h } from 'preact'
import PrivacyStatement from '../PrivacyStatement'

export default WrappedComponent =>
  props => (
    process.env.PRIVACY_FEATURE_ENABLED && !props.termsAccepted ?
      <PrivacyStatement {...props} /> :
      <WrappedComponent {...props}
  )