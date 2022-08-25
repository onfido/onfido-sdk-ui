import { h } from 'preact'
import { localised } from '~locales'
import { asyncComponent } from '~utils/components'
import style from './style.scss'
import type { PhoneNumberInputProps } from './index'
import type { ProfileDataPhoneNumberInputProps } from './ProfileDataphoneNumberInput'

const Loading = localised(({ translate }) => (
  <div className={style.loading}>
    {translate('generic.lazy_load_placeholder')}
  </div>
))

const AsyncCrossDevice = asyncComponent(
  () => import(/* webpackChunkName: "crossDevice" */ './index'),
  Loading
)
const ProfileDataPhoneInputAsyncCrossDevice = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "crossDevice" */ './ProfileDataphoneNumberInput'
    ),
  Loading
)

const PhoneNumberInputLazy = (props: PhoneNumberInputProps) => (
  <AsyncCrossDevice {...props} />
)
export const ProfileDataPhoneNumberInput = localised(
  (props: ProfileDataPhoneNumberInputProps) => (
    <ProfileDataPhoneInputAsyncCrossDevice {...props} />
  )
)

export default localised(PhoneNumberInputLazy)
