import { h } from 'preact'
import { localised } from '../../locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'

const Loading = localised(({ translate }) => (
  <div className={style.loading}>
    {translate('generic.lazy_load_placeholder')}
  </div>
))

const AsyncCrossDevice = asyncComponent(
  //@ts-ignore
  () => import(/* webpackChunkName: "vendor" */ './Auth.js'),
  Loading
)

const AuthLazy = (props) => <AsyncCrossDevice {...props} />

export default localised(AuthLazy)
