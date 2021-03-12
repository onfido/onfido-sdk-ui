import { h, FunctionComponent, Fragment } from 'preact'
import {
  useEffect,
  useState,
  useContext,
  unmountComponentAtNode,
} from 'preact/compat'
import { sanitize } from 'dompurify'

import { useSdkOptions } from '~contexts'
import { LocaleContext } from '~locales'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import Button from '../Button'
import DeclineModal from './DeclineModal'
import style from './style.scss'

import type { StepComponentBaseProps } from '~types/routers'
import type { ApiRawError, SuccessCallback } from '~types/api'

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
        className={style.secondary}
        variants={['secondary', 'sm']}
        uiTestDataAttribute={'userConsentBtnSecondary'}
        onClick={onDecline}
      >
        {secondaryBtnCopy}
      </Button>
      <Button
        variants={['primary', 'sm']}
        uiTestDataAttribute={'userConsentBtnPrimary'}
        onClick={onAccept}
      >
        {primaryBtnCopy}
      </Button>
    </div>
  )
}

const getConsentFile = (
  onSuccess: SuccessCallback<string>,
  onError: (error: ApiRawError) => void
): void => {
  const request = new XMLHttpRequest()
  request.open('GET', process.env.USER_CONSENT_URL)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      onSuccess(request.responseText)
    } else {
      // TODO in CX-6197: if there is an error, we will display a reload screen
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send()
}

const UserConsent: FunctionComponent<StepComponentBaseProps> = ({
  nextStep,
}) => {
  const { containerEl, containerId, events } = useSdkOptions()
  const [consentHtml, setConsentHtml] = useState('')
  const [isModalOpen, setModalToOpen] = useState(false)
  const sdkContainer = containerEl || document.getElementById(containerId)

  const actions = (
    <Actions
      onAccept={nextStep}
      onDecline={() => {
        setModalToOpen(true)
      }}
    />
  )

  const triggerUserExit = () => {
    setModalToOpen(false)
    events.emit('userExit', 'USER_CONSENT_DENIED')
    unmountComponentAtNode(sdkContainer)
  }

  useEffect(() => {
    new Promise<string>((resolve, reject) => {
      getConsentFile(resolve, reject)
    })
      .then((html) => setConsentHtml(html))
      .catch((err) => console.error(err))
  }, [])

  return (
    <Fragment>
      {isModalOpen && (
        <DeclineModal
          isOpen={true}
          onRequestClose={() => setModalToOpen(false)}
          onDismissModal={() => setModalToOpen(false)}
          onAbandonFlow={triggerUserExit}
          containerEl={sdkContainer}
        />
      )}
      <ScreenLayout actions={actions}>
        <div
          className={style.consentFrame}
          data-onfido-qa="userConsentFrameWrapper"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: sanitize(consentHtml, { ADD_ATTR: ['target', 'rel'] }),
          }}
        />
      </ScreenLayout>
    </Fragment>
  )
}
export default trackComponent(UserConsent)
