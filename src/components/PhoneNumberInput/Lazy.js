import { h } from 'preact'
import { localised } from '../../locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'

const Loading = localised(({ translate }) =>
  <div className={style.loading}>{translate('cross_device.loading')}</div>
)

const AsyncCrossDevice = asyncComponent(() => import(/* webpackChunkName: "crossDevice" */ './index.js'), Loading);

const PhoneNumberInputLazy = (props) => <AsyncCrossDevice {...props}/>

export default localised(PhoneNumberInputLazy)
