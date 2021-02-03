import { h, FunctionComponent } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import { localised } from '../../locales'
import Button from '../Button'
import theme from '../Theme/style.scss'
import style from './style.scss'

const Actions: FunctionComponent = () => (
  <div className={theme.thickWrapper}>
    <Button variants={['primary', 'sm']} onClick={() => {}}>
      hello
    </Button>
  </div>
)

const UserConsent: FunctionComponent = () => {
  return (
    <ScreenLayout actions={<Actions />}>
      <div className={theme.thickWrapper}>
        <iframe
          className={style.consentFrame}
          title="Onfido User Consent Frame"
          src={process.env.USER_CONSENT_URL}
        />
      </div>
    </ScreenLayout>
  )
}
export default trackComponent(localised(UserConsent))
