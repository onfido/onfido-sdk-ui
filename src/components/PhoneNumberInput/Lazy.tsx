import { h } from 'preact'
import { localised } from '~locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'
import type { PhoneNumberInputProps } from './index'

const Loading = localised(({ translate }) => (
  <div className={style.loading}>
    {translate('generic.lazy_load_placeholder')}
  </div>
))

const AsyncCrossDevice = asyncComponent(
  () => import(/* webpackChunkName: "crossDevice" */ './index'),
  Loading
)

const PhoneNumberInputLazy = (props: PhoneNumberInputProps) => (
  <AsyncCrossDevice {...props} />
)

export default localised(PhoneNumberInputLazy)
