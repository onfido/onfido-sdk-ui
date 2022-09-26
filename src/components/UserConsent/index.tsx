import { h, FunctionComponent, Fragment } from 'preact'
import {
  useEffect,
  useState,
  unmountComponentAtNode,
  useCallback,
} from 'preact/compat'
import classNames from 'classnames'
import { sanitize } from 'dompurify'
import { Button } from '@onfido/castor-react'

import { useSdkOptions } from '~contexts'
import { useLocales } from '~locales'
import { trackComponent } from '../../Tracker'
import ReloadContent from './ReloadContent'
import ScreenLayout from '../Theme/ScreenLayout'
import { isButtonGroupStacked } from '../Theme/utils'
import theme from '../Theme/style.scss'

import DeclineModal from './DeclineModal'
import style from './style.scss'

import type { StepComponentBaseProps } from '~types/routers'
import type { ApiRawError, SuccessCallback } from '~types/api'
import Spinner from '../Spinner'
import useUserConsent from '~contexts/useUserConsent'

type ActionsProps = {
  onAccept(): void
  onDecline(): void
}

const Actions: FunctionComponent<ActionsProps> = ({ onAccept, onDecline }) => {
  const { translate } = useLocales()
  const primaryBtnCopy = translate('user_consent.button_primary')
  const secondaryBtnCopy = translate('user_consent.button_secondary')

  return (
    <div
      className={classNames(style.actions, {
        [style.vertical]: isButtonGroupStacked(),
      })}
    >
      <Button
        type="button"
        variant="secondary"
        className={classNames(
          theme['button-sm'],
          style.action,
          style.secondary,
          {
            [style.vertical]: isButtonGroupStacked(),
          }
        )}
        data-onfido-qa="userConsentBtnSecondary"
        onClick={onDecline}
      >
        {secondaryBtnCopy}
      </Button>
      <Button
        type="button"
        variant="primary"
        className={classNames(theme['button-sm'], style.action, {
          [style.vertical]: isButtonGroupStacked(),
        })}
        data-onfido-qa="userConsentBtnPrimary"
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

  if (!process.env.USER_CONSENT_URL) {
    throw new Error('USER_CONSENT_URL env var was not set')
  }

  request.open('GET', process.env.USER_CONSENT_URL)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      onSuccess(request.responseText)
    } else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send()
}

const UserConsent: FunctionComponent<StepComponentBaseProps> = ({
  nextStep,
}) => {
  const [{ containerEl, containerId, events }] = useSdkOptions()
  const { updateConsents } = useUserConsent()
  const [loading, setLoading] = useState(false)
  const [consentHtml, setConsentHtml] = useState('')
  const [isModalOpen, setModalToOpen] = useState(false)
  const [isContentLoadError, setContentLoadError] = useState(false)

  const openModal = () => setModalToOpen(true)
  const closeModal = () => setModalToOpen(false)

  const sdkContainer =
    containerEl || document.getElementById(containerId || '') || undefined

  const triggerUserExit = () => {
    events?.emit('userExit', 'USER_CONSENT_DENIED')
    sdkContainer && unmountComponentAtNode(sdkContainer)
  }

  const onContentLoadSuccess = (html: string) => {
    setContentLoadError(false)
    setConsentHtml(html)
  }

  const onContentLoadFailed = (err: string) => {
    console.error(err)
    setContentLoadError(true)
  }

  const fetchConsentFile = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        getConsentFile(resolve, reject)
      })
        .then(onContentLoadSuccess)
        .catch(onContentLoadFailed),
    []
  )

  const onAccept = () => {
    setLoading(true)
    updateConsents(true).then(nextStep).catch(onContentLoadFailed)
  }

  const onReject = () => {
    setLoading(true)
    updateConsents(false).then(triggerUserExit).catch(onContentLoadFailed)
  }

  useEffect(() => {
    fetchConsentFile()
  }, [fetchConsentFile])

  const actions = <Actions onAccept={onAccept} onDecline={openModal} />

  if (isContentLoadError) {
    return <ReloadContent onPrimaryButtonClick={fetchConsentFile} />
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Fragment>
      <DeclineModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onDismissModal={closeModal}
        onAbandonFlow={onReject}
        containerEl={sdkContainer}
      />
      <ScreenLayout actions={actions} pageId={'UserConsent'}>
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
