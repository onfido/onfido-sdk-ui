import { h } from 'preact'
import { localised } from '../../locales'
import { asyncComponent } from '~utils/components'
import Spinner from '../Spinner'

const AsyncSelfie = asyncComponent(
  () => import(/* webpackChunkName: "selfie" */ './Selfie.js'),
  Spinner
)

const SelfieLazy = (props) => <AsyncSelfie {...props} />

export default localised(SelfieLazy)
