import { h } from 'preact'

import { isDesktop, addDeviceRelatedProperties } from '~utils'
import { validateFile } from '~utils/file'
import { POA_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'

import { appendToTracking, trackException } from '../../Tracker'
import { useLocales } from '~locales'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import FallbackButton from '../Button/FallbackButton'
import theme from '../Theme/style.scss'

import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'

import type { ImageResizeInfo } from '~types/commons'
import type { WithCaptureVariantProps } from '~types/hocs'
import type { DocumentCapture } from '~types/redux'
import type {
  HandleCaptureProp,
  RenderFallbackProp,
  StepComponentDocumentProps,
} from '~types/routers'
import type { PoaTypes } from '~types/steps'

const EXCEPTIONS = {
  DOC_TYPE_NOT_PROVIDED: 'poaDocumentType was not provided',
}

const getDocumentType = (poaDocumentType?: PoaTypes): PoaTypes => {
  if (poaDocumentType) {
    return poaDocumentType
  }

  trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
  throw new Error(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
}

type Props = StepComponentDocumentProps & WithCaptureVariantProps

const Document = (props: Props) => {
  const { translate } = useLocales()

  const handlePhotoCapture: HandleCaptureProp = (payload) => {
    const { actions, mobileFlow, nextStep, poaDocumentType } = props

    const documentCaptureData: DocumentCapture = {
      ...payload,
      documentType: getDocumentType(poaDocumentType),
      id: payload.id || randomId(),
      method: 'poa',
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      variant: 'standard',
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  const handleUpload = (blob: Blob, imageResizeInfo?: ImageResizeInfo) =>
    handlePhotoCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  const handleError = () => {
    const { actions, requestedVariant: variant } = props
    actions.deleteCapture({ method: 'poa', variant })
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

  const { hasCamera, poaDocumentType, useWebcam } = props

  const renderFallback = isDesktop
    ? renderCrossDeviceFallback
    : renderUploadFallback

  const title = translate(
    POA_CAPTURE_LOCALES_MAPPING[getDocumentType(poaDocumentType)]?.title || ''
  )
  const propsWithErrorHandling = {
    ...props,
    forceCrossDevice: props.forceCrossDevice ?? false,
    onError: handleError,
  }
  const renderTitle = <PageTitle title={title} smaller />

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

  // Different upload types show different icons
  // return the right icon name for document
  // For document, the upload can be 'identity' or 'proof_of_address'

  // TODO: why do we try to get the document type group from the document type again. It would make much more sense
  //  to have the overall properties know about the current step and then just take the upload type from the current step

  // @ts-ignore
  const uploadType = getDocumentTypeGroup(poaDocumentType || documentType)
  const instructions = translate(
    POA_CAPTURE_LOCALES_MAPPING[getDocumentType(poaDocumentType)]?.body || ''
  )

  return (
    <Uploader
      {...propsWithErrorHandling}
      uploadType={uploadType}
      onUpload={handleUpload}
      title={title}
      instructions={instructions}
      pageId={'DocumentUploader'}
    />
  )
}

export default appendToTracking(withCrossDeviceWhenNoCamera(Document))
