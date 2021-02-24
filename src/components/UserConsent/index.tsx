import { h, FunctionComponent } from 'preact'
import { useEffect, useState, useContext } from 'preact/hooks'
import { Button } from '@onfido/castor-react'
import { LocaleContext } from '~locales'
import { sanitize } from 'dompurify'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { StepComponentUserConsentProps } from '~types/routers'

type UserConsentProps = StepComponentUserConsentProps

type ActionsProps = {
  onAccept(): void
  onDecline(): void
}

const Actions: FunctionComponent<ActionsProps> = ({ onAccept, onDecline }) => {
  const { translate } = useContext(LocaleContext)
  const primaryBtnCopy = translate('user_consent.button_primary')
  const secondaryBtnCopy = translate('user_consent.button_secondary')
  return (
    <div className={style.actions}>
      <Button
        variant="secondary"
        className={theme['button-sm']}
        data-onfido-qa="userConsentBtnSecondary"
        onClick={onDecline}
      >
        {secondaryBtnCopy}
      </Button>
      <Button
        variant="primary"
        className={theme['button-sm']}
        data-onfido-qa="userConsentBtnPrimary"
        onClick={onAccept}
      >
        {primaryBtnCopy}
      </Button>
    </div>
  )
}

const UserConsent: FunctionComponent<UserConsentProps> = ({
  nextStep,
  previousStep,
}) => {
  const actions = <Actions onAccept={nextStep} onDecline={previousStep} />
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
        data-onfido-qa="userConsentFrameWrapper"
        dangerouslySetInnerHTML={{
          __html: sanitize(consentHtml, { ADD_ATTR: ['target', 'rel'] }),
        }}
      />
    </ScreenLayout>
  )
}
export default trackComponent(UserConsent)
