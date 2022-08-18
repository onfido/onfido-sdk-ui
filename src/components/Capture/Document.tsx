import { h } from 'preact'

import { isDesktop, isHybrid, addDeviceRelatedProperties } from '~utils'
import { validateFile } from '~utils/file'
import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'

import { appendToTracking, trackException } from '../../Tracker'
import { useLocales } from '~locales'
import DocumentVideo from '../DocumentVideo'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import FallbackButton from '../Button/FallbackButton'
import theme from '../Theme/style.scss'

import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import style from './style.scss'

import type { ImageResizeInfo } from '~types/commons'
import type {
  TrackEventBeforeMountCallback,
  WithCaptureVariantProps,
} from '~types/hocs'
import type { DocumentCapture } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocMultiFrameCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
  StepComponentDocumentProps,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'
import DocumentMultiFrame from 'components/DocumentMultiFrame'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'

const EXCEPTIONS = {
  DOC_TYPE_NOT_PROVIDED: 'documentType was not provided',
  CAPTURE_SIDE_NOT_PROVIDED: 'Capture side was not provided',
}

const getDocumentType = (documentType?: DocumentTypes): DocumentTypes => {
  if (documentType) {
    return documentType
  }

  trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
  throw new Error(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
}

type Props = StepComponentDocumentProps & WithCaptureVariantProps

const Document = (props: Props) => {
  const { translate } = useLocales()
  const sdkConfiguration = useSdkConfigurationService()

  const handlePhotoCapture: HandleCaptureProp = (payload) => {
    const { actions, documentType, mobileFlow, nextStep, side } = props

    const documentCaptureData: DocumentCapture = {
      ...payload,
      documentType: getDocumentType(documentType),
      id: payload.id || randomId(),
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      side,
      variant: 'standard',
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  const handleVideoCapture: HandleDocVideoCaptureProp = (payload) => {
    const { actions, documentType, mobileFlow, nextStep } = props
    const { video, front, back } = payload

    if (!documentType) {
      trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
      throw new Error('documentType not provided')
    }

    const baseData: Omit<DocumentCapture, 'blob' | 'id'> = {
      documentType,
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(
        video?.sdkMetadata || {},
        mobileFlow
      ),
    }

    actions.createCapture({
      ...front,
      ...baseData,
      id: randomId(),
      side: 'front',
    })

    if (back) {
      actions.createCapture({
        ...back,
        ...baseData,
        id: randomId(),
        side: 'back',
      })
    }

    actions.createCapture({
      ...video,
      ...baseData,
      id: randomId(),
      variant: 'video',
    })

    nextStep()
  }

  const handleMultiFrameCapture: HandleDocMultiFrameCaptureProp = (payload) => {
    const { actions, documentType, mobileFlow, side, nextStep } = props
    const { video, photo } = payload

    if (!documentType) {
      trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
      throw new Error('documentType not provided')
    }

    const baseData: Omit<DocumentCapture, 'blob' | 'id'> = {
      documentType,
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(
        video?.sdkMetadata || {},
        mobileFlow
      ),
    }

    actions.createCapture({
      ...photo,
      ...baseData,
      id: randomId(),
      side,
    })

    actions.createCapture({
      ...video,
      ...baseData,
      id: randomId(),
      variant: 'video',
      side,
    })

    nextStep()
  }

  const handleUpload = (blob: Blob, imageResizeInfo?: ImageResizeInfo) =>
    handlePhotoCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  const handleError = () => {
    const { actions, side, requestedVariant: variant } = props
    actions.deleteCapture({ method: 'document', side, variant })
  }

  const handleFileSelected = (file: File) =>
    validateFile(file, handleUpload, handleError)

  const renderUploadFallback: RenderFallbackProp = ({ text }) => (
    <CustomFileInput
      className={theme.warningFallbackButton}
      onChange={handleFileSelected}
      accept="image/*"
      capture="environment"
    >
      {text}
    </CustomFileInput>
  )

  const renderCrossDeviceFallback: RenderFallbackProp = ({ text }) => {
    const { changeFlowTo } = props
    return (
      <FallbackButton
        text={text}
        onClick={() => changeFlowTo('crossDeviceSteps')}
      />
    )
  }

  const {
    documentType,
    hasCamera,
    requestedVariant,
    side,
    trackScreen,
    uploadFallback = true,
    useLiveDocumentCapture,
    useWebcam,
  } = props

  const renderFallback = isDesktop
    ? renderCrossDeviceFallback
    : renderUploadFallback

  if (hasCamera && requestedVariant === 'video') {
    if (!documentType) {
      trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
      throw new Error('documentType not provided')
    }

    return (
      <DocumentVideo
        documentType={documentType}
        onCapture={handleVideoCapture}
        renderFallback={renderFallback}
        trackScreen={trackScreen}
      />
    )
  }

  if (!side) {
    trackException(EXCEPTIONS.CAPTURE_SIDE_NOT_PROVIDED)
    throw new Error(EXCEPTIONS.CAPTURE_SIDE_NOT_PROVIDED)
  }

  const title = translate(
    DOCUMENT_CAPTURE_LOCALES_MAPPING[getDocumentType(documentType)][side]
      ?.title || ''
  )
  const propsWithErrorHandling = {
    ...props,
    forceCrossDevice: props.forceCrossDevice ?? false,
    onError: handleError,
  }
  const renderTitle = <PageTitle title={title} smaller />
  const enableLiveDocumentCapture =
    useLiveDocumentCapture && (!isDesktop || isHybrid)

  const trackEvent: TrackEventBeforeMountCallback = () => ({
    event: 'DOCUMENT_CAPTURE',
    properties: {
      country_code: props.idDocumentIssuingCountry?.country_alpha2,
      document_type: props.documentType,
    },
  })

  if (hasCamera && useWebcam) {
    return (
      <DocumentAutoCapture
        {...propsWithErrorHandling}
        renderFallback={renderFallback}
        renderTitle={renderTitle}
        onValidCapture={handlePhotoCapture}
      />
    )
  }

  if (hasCamera && enableLiveDocumentCapture) {
    if (!documentType) {
      trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
      throw new Error('documentType not provided')
    }

    if (sdkConfiguration.experimental_features?.enable_multi_frame_capture) {
      return (
        <DocumentMultiFrame
          documentType={documentType}
          onCapture={handleMultiFrameCapture}
          renderFallback={renderFallback}
          trackScreen={trackScreen}
          side={side}
          trackEventBeforeMount={trackEvent}
        />
      )
    }

    return (
      <DocumentLiveCapture
        containerClassName={style.liveDocumentContainer}
        documentType={documentType}
        isUploadFallbackDisabled={!uploadFallback}
        onCapture={handlePhotoCapture}
        renderFallback={renderFallback}
        renderTitle={renderTitle}
        trackScreen={trackScreen}
        trackEventBeforeMount={trackEvent}
      />
    )
  }

  // Different upload types show different icons
  // return the right icon name for document
  // For document, the upload can be 'identity' or 'proof_of_address'

  // TODO: why do we try to get the document type group from the document type again. It would make much more sense
  //  to have the overall properties know about the current step and then just take the upload type from the current step

  // @ts-ignore
  const uploadType = getDocumentTypeGroup(documentType)
  const instructions = translate(
    DOCUMENT_CAPTURE_LOCALES_MAPPING[getDocumentType(documentType)][side]
      ?.body || ''
  )

  return (
    <Uploader
      {...propsWithErrorHandling}
      uploadType={uploadType}
      onUpload={handleUpload}
      title={title}
      instructions={instructions}
      pageId={'DocumentUploader'}
      countryCode={props.idDocumentIssuingCountry?.country_alpha2}
      trackEventBeforeMount={trackEvent}
    />
  )
}

export default appendToTracking(withCrossDeviceWhenNoCamera(Document))
