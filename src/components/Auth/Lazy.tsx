import { h, ComponentType } from 'preact'
import { localised } from '../../locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'
import Loader from './assets/loaderSvg'

const Loading = () => (
  <div className={style.loading}>
    <Loader />
  </div>
)

const AuthCapture = asyncComponent(
  () => import(/* webpackChunkName: "authVendor" */ './Auth'),
  Loading
)

const AuthLazy = (props: ComponentType<Element>) => <AuthCapture {...props} />

export default localised(AuthLazy)
