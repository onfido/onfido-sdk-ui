import { h, FunctionComponent } from 'preact'
import { memo, useCallback, useContext, useState } from 'preact/compat'
import type { Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import { uploadDocument, uploadDocumentVideo } from '~utils/onfidoApi'
import { actions } from 'components/ReduxAppWrapper/store/actions'
import Button from '../../Button'
import Error from '../../Error'
import Spinner from '../../Spinner'
import Content from './Content'
import style from './style.scss'

import type { ApiParsedError } from '~types/api'
import type { CountryData } from '~types/commons'
import type { CombinedActions, RootState, DocumentCapture } from '~types/redux'
import type { ErrorProp, StepComponentDocumentProps } from '~types/routers'

const Confirm: FunctionComponent<StepComponentDocumentProps> = ({
  documentType,
  nextStep,
  previousStep,
  token,
}) => {
  const [loading, setLoading] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [error, setError] = useState<ErrorProp>(null)
  const { translate } = useContext(LocaleContext)

  const dispatch = useDispatch<Dispatch<CombinedActions>>()
  const apiUrl = useSelector<RootState, string>(
    (state) => state.globals.urls.onfido_api_url
  )
  const documentFront = useSelector<RootState, DocumentCapture>(
    (state) => state.captures.document_front
  )
  const documentBack = useSelector<RootState, DocumentCapture>(
    (state) => state.captures.document_back
  )
  const documentVideo = useSelector<RootState, DocumentCapture>(
    (state) => state.captures.document_video
  )
  const issuingCountry = useSelector<RootState, CountryData>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const onUploadDocument = useCallback(async () => {
    setLoading(true)

    const issuingCountryData =
      documentType === 'passport'
        ? {}
        : {
            issuing_country: issuingCountry.country_alpha3,
          }

    try {
      const frontUploadResponse = await uploadDocument(
        {
          file: documentFront.blob,
          sdkMetadata: documentFront.sdkMetadata,
          side: 'front',
          type: documentType,
          validations: { detect_document: 'error' },
          ...issuingCountryData,
        },
        apiUrl,
        token
      )

      dispatch(
        actions.setCaptureMetadata({
          capture: documentFront,
          apiResponse: frontUploadResponse,
        })
      )

      if (documentBack) {
        const backUploadResponse = await uploadDocument(
          {
            file: documentBack.blob,
            sdkMetadata: documentBack.sdkMetadata,
            side: 'back',
            type: documentType,
            validations: { detect_document: 'error' },
            ...issuingCountryData,
          },
          apiUrl,
          token
        )

        dispatch(
          actions.setCaptureMetadata({
            capture: documentBack,
            apiResponse: backUploadResponse,
          })
        )
      }

      const videoUploadResponse = await uploadDocumentVideo(
        {
          blob: documentVideo.blob,
          sdkMetadata: documentVideo.sdkMetadata,
          ...issuingCountryData,
        },
        apiUrl,
        token
      )

      dispatch(
        actions.setCaptureMetadata({
          capture: documentVideo,
          apiResponse: videoUploadResponse,
        })
      )

      nextStep()
    } catch (errorResponse) {
      setLoading(false)
      const {
        response: { error },
      } = errorResponse as ApiParsedError

      if (error?.type === 'validation_error') {
        if (error?.fields.document_detection) {
          setError({ name: 'INVALID_CAPTURE', type: 'error' })
        }
      } else {
        setError({ name: 'REQUEST_ERROR', type: 'error' })
      }
    }
  }, [
    documentType,
    nextStep,
    token,
    dispatch,
    apiUrl,
    documentFront,
    documentBack,
    documentVideo,
    issuingCountry,
  ])

  const onSecondaryClick = useCallback(() => {
    if (error || previewing) {
      previousStep()
      return
    }

    setPreviewing(true)
  }, [error, previewing, previousStep])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className={style.container}>
      {error ? <Error error={error} role="alert" /> : <div />}
      {!error && <Content capture={documentVideo} previewing={previewing} />}
      <div className={style.buttonsContainer}>
        <Button
          onClick={onUploadDocument}
          variants={['primary', 'lg', 'centered']}
        >
          {translate('doc_video_confirmation.button_upload')}
        </Button>
        <Button
          onClick={onSecondaryClick}
          variants={['secondary', 'lg', 'centered']}
        >
          {translate(
            error || previewing
              ? 'doc_video_confirmation.button_redo'
              : 'doc_video_confirmation.button_preview'
          )}
        </Button>
      </div>
    </div>
  )
}

export default memo(Confirm)
