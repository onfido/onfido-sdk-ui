import { h } from 'preact'
import PrivacyStatement from '../PrivacyStatement'
import { identity } from '../utils/func'

const withPrivacyStatement = !process.env.PRIVACY_FEATURE_ENABLED ? identity :
  WrappedComponent =>
    props =>
      !props.termsAccepted ?
        <PrivacyStatement {...props} /> :
        <WrappedComponent {...props} />

export default withPrivacyStatement
