import { h, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import dompurify from 'dompurify'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import { localised } from '../../locales'
import Button from '../Button'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentUserConsentProps } from '~types/routers'

type UserConsentProps = StepComponentUserConsentProps & WithLocalisedProps

type ActionsProps = {
  onAccept(): void
  onDecline(): void
  translate(arg: string): string
}

const Actions: FunctionComponent<ActionsProps> = ({
  onAccept,
  onDecline,
  translate,
}) => {
  const primaryBtnCopy = translate('user_consent.button_primary')
  const secondaryBtnCopy = translate('user_consent.button_secondary')
  return (
    <div className={style.actions}>
      <Button
        className={style.secondary}
        variants={['secondary', 'sm']}
        onClick={onDecline}
      >
        {secondaryBtnCopy}
      </Button>
      <Button variants={['primary', 'sm']} onClick={onAccept}>
        {primaryBtnCopy}
      </Button>
    </div>
  )
}

const UserConsent: FunctionComponent<UserConsentProps> = ({
  nextStep,
  previousStep,
  translate,
}): h.JSX.Element => {
  const actions = (
    <Actions
      onAccept={nextStep}
      onDecline={previousStep}
      translate={translate}
    />
  )
  const sanitizer = dompurify.sanitize
  const [consentHtml, setConsentHtml] = useState('')

  useEffect(() => {
    fetch(process.env.USER_CONSENT_URL)
      .then((data) => data.text())
      .then((html) => setConsentHtml(html))
  }, [])

  return (
    <ScreenLayout actions={actions}>
      <div
        className={style.consentFrame}
        dangerouslySetInnerHTML={{ __html: sanitizer(consentHtml) }}
      />
    </ScreenLayout>
  )
}
export default trackComponent(localised(UserConsent))
