import { h, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import dompurify from 'dompurify'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import { localised } from '../../locales'
import Button from '../Button'
// import theme from '../Theme/style.scss'
import style from './style.scss'

interface ActionsProps {
  onAccept(): void
}

const Actions: FunctionComponent<{ props: ActionsProps }> = (props) => {
  const onAcceptCb = props.onAccept

  return (
    <div className={style.actions}>
      <Button
        className={style.secondary}
        variants={['secondary', 'sm']}
        onClick={() => {}}
      >
        Do not accept
      </Button>
      <Button variants={['primary', 'sm']} onClick={() => onAcceptCb()}>
        Accept
      </Button>
    </div>
  )
}

const UserConsent: FunctionComponent = (props) => {
  const sanitizer = dompurify.sanitize
  const [consentHtml, setConsentHtml] = useState('')

  useEffect(() => {
    fetch(process.env.USER_CONSENT_URL)
      .then((data) => data.text())
      .then((html) => setConsentHtml(html))
  }, [])

  return (
    <ScreenLayout actions={<Actions onAccept={props.nextStep} />}>
      <div
        className={style.consentFrame}
        dangerouslySetInnerHTML={{ __html: sanitizer(consentHtml) }}
      />
    </ScreenLayout>
  )
}
export default trackComponent(localised(UserConsent))
