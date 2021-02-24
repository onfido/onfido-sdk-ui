import { h, FunctionComponent } from 'preact'
import { memo, useCallback, useContext, useState } from 'preact/compat'
import type { Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import {
  uploadDocument,
  uploadDocumentVideo,
  uploadBinaryMedia,
  createV4Document,
} from '~utils/onfidoApi'
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

  const onUploadDocumentsV3 = useCallback(async () => {
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

      if (
        error?.type === 'validation_error' &&
        error?.fields.document_detection != null
      ) {
        setError({ name: 'INVALID_CAPTURE', type: 'error' })
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

  const onUploadDocumentsV4 = useCallback(async () => {
    setLoading(true)

    const mediaUuids = []

    try {
      const { media_id: frontMediaUuid } = await uploadBinaryMedia(
        {
          file: documentFront.blob,
          filename: documentFront.filename,
          sdkMetadata: documentFront.sdkMetadata,
        },
        apiUrl,
        token
      )

      mediaUuids.push(frontMediaUuid)
      dispatch(
        actions.deleteCapture({
          method: 'document',
          side: 'front',
        })
      )

      if (documentBack) {
        const { media_id: backMediaUuid } = await uploadBinaryMedia(
          {
            file: documentBack.blob,
            filename: documentBack.filename,
            sdkMetadata: documentBack.sdkMetadata,
          },
          apiUrl,
          token
        )

        mediaUuids.push(backMediaUuid)
        dispatch(
          actions.deleteCapture({
            method: 'document',
            side: 'back',
          })
        )
      }

      const { media_id: videoMediaUuid } = await uploadBinaryMedia(
        {
          file: documentVideo.blob,
          filename: documentVideo.filename,
          sdkMetadata: documentVideo.sdkMetadata,
        },
        apiUrl,
        token,
        true // includes file HMAC Auth
      )

      mediaUuids.push(videoMediaUuid)

      const { uuid: documentUuid } = await createV4Document(
        mediaUuids,
        apiUrl,
        token
      )

      dispatch(
        actions.setCaptureMetadata({
          capture: documentVideo,
          apiResponse: {
            id: documentUuid,
            media_uuids: mediaUuids,
          },
        })
      )

      nextStep()
    } catch (errorResponse) {
      setLoading(false)
      setError({ name: 'REQUEST_ERROR', type: 'error' })
    }
  }, [
    nextStep,
    token,
    dispatch,
    apiUrl,
    documentFront,
    documentBack,
    documentVideo,
  ])

  const onUploadDocuments =
    process.env.USE_V4_APIS_FOR_DOC_VIDEO === 'true'
      ? onUploadDocumentsV4
      : onUploadDocumentsV3

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
          onClick={onUploadDocuments}
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
