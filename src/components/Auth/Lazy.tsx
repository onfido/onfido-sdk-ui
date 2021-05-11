import { h, ComponentType } from 'preact'
import { localised } from '../../locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'

const Loading = localised(({ translate }) => (
  <div className={style.loading}>
    {translate('generic.lazy_load_placeholder')}
  </div>
))

const AuthCapture = asyncComponent(
  () => import(/* webpackChunkName: "authVendor" */ './Auth'),
  Loading
)

const AuthLazy = (props: ComponentType<Element>) => <AuthCapture {...props} />

export default localised(AuthLazy)
