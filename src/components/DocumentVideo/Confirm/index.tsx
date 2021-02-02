import { h, FunctionComponent } from 'preact'
import { useCallback, useContext, useState } from 'preact/compat'
import { useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import { uploadDocument, uploadDocumentVideo } from '~utils/onfidoApi'
import Button from '../../Button'
import Error from '../../Error'
import Spinner from '../../Spinner'
import style from './style.scss'

import type { RootState } from 'components/ReduxAppWrapper/store/reducers'
import type { ApiError } from '~types/api'
import type { CountryData } from '~types/commons'
import type { CapturePayload } from '~types/redux'
import type { ErrorProp, StepComponentDocumentProps } from '~types/routers'

const Confirm: FunctionComponent<StepComponentDocumentProps> = ({
  documentType,
  nextStep,
  previousStep,
  token,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorProp>(null)
  const { translate } = useContext(LocaleContext)

  const apiUrl = useSelector<RootState, string>(
    (state) => state.globals.urls.onfido_api_url
  )
  const documentFront = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_front
  )
  const documentBack = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_back
  )
  const documentVideo = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_video
  )
  const issuingCountry = useSelector<RootState, CountryData>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const onUploadDocument = useCallback(async () => {
    setLoading(true)

    if (documentType !== 'passport') {
      console.log('issuingCountry', issuingCountry)
    }

    try {
      await uploadDocument(
        {
          file: documentFront.blob,
          sdkMetadata: documentFront.sdkMetadata,
          side: 'front',
          type: documentType,
          validations: { detect_document: 'error' },
        },
        apiUrl,
        token
      )

      await uploadDocument(
        {
          file: documentBack.blob,
          sdkMetadata: documentBack.sdkMetadata,
          side: 'back',
          type: documentType,
          validations: { detect_document: 'error' },
        },
        apiUrl,
        token
      )

      await uploadDocumentVideo(
        {
          blob: documentVideo.blob,
          sdkMetadata: documentVideo.sdkMetadata,
        },
        apiUrl,
        token
      )

      nextStep()
    } catch (error) {
      setLoading(false)
      const { response, status } = error as ApiError
      console.log({ response, status })
      setError({ name: 'REQUEST_ERROR', type: 'error' })
    }
  }, [
    documentType,
    nextStep,
    token,
    apiUrl,
    documentFront,
    documentBack,
    documentVideo,
  ])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className={style.container}>
      {error ? <Error error={error} role="alert" /> : <div />}
      {!error && (
        <div className={style.content}>
          <span className={style.icon} />
          <span className={style.title}>
            {translate('doc_video_confirmation.title')}
          </span>
          <span className={style.body}>
            {translate('doc_video_confirmation.body')}
          </span>
        </div>
      )}
      <div className={style.buttonsContainer}>
        <Button
          onClick={onUploadDocument}
          variants={['primary', 'lg', 'centered']}
        >
          {translate('doc_video_confirmation.button_upload')}
        </Button>
        <Button
          onClick={previousStep}
          variants={['secondary', 'lg', 'centered']}
        >
          {translate('doc_video_confirmation.button_redo')}
        </Button>
      </div>
    </div>
  )
}

export default Confirm
