import { h, Component } from 'preact'

import { isDesktop, isHybrid, addDeviceRelatedProperties } from '~utils'
import { validateFile } from '~utils/file'
import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'

import { appendToTracking, trackException } from '../../Tracker'
import { localised } from '../../locales'
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
import type { WithLocalisedProps, WithCaptureVariantProps } from '~types/hocs'
import type { DocumentCapture } from '~types/redux'
import type {
  HandleCaptureProp,
  StepComponentDocumentProps,
} from '~types/routers'
import type { DocumentTypes, PoaTypes } from '~types/steps'

const EXCEPTIONS = {
  DOC_TYPE_NOT_PROVIDED: 'Neither documentType nor poaDocumentType provided',
  CAPTURE_SIDE_NOT_PROVIDED: 'Capture size was not provided',
}

const getDocumentType = (
  isPoA?: boolean,
  documentType?: DocumentTypes,
  poaDocumentType?: PoaTypes
): DocumentTypes | PoaTypes => {
  if (isPoA && poaDocumentType) {
    return poaDocumentType
  }

  if (documentType) {
    return documentType
  }

  trackException(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
  throw new Error(EXCEPTIONS.DOC_TYPE_NOT_PROVIDED)
}

type Props = StepComponentDocumentProps &
  WithLocalisedProps &
  WithCaptureVariantProps

class Document extends Component<Props> {
  static defaultProps: Partial<Props> = {
    forceCrossDevice: false,
    requestedVariant: 'standard',
    side: 'front',
  }

  handleCapture: HandleCaptureProp = ({ variant, ...payload }) => {
    const {
      actions,
      documentType,
      isPoA,
      mobileFlow,
      nextStep,
      poaDocumentType,
      side,
    } = this.props

    const documentCaptureData: DocumentCapture = {
      ...payload,
      documentType: getDocumentType(isPoA, documentType, poaDocumentType),
      id: payload.id || randomId(),
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      side: variant === 'video' ? undefined : side,
      variant: variant || 'standard',
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleUpload = (blob: Blob, imageResizeInfo?: ImageResizeInfo) =>
    this.handleCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  handleError = () => {
    const { actions, side } = this.props
    actions.deleteCapture({ method: 'document', side })
  }

  handleFileSelected = (file: File) =>
    validateFile(file, this.handleUpload, this.handleError)

  renderUploadFallback = (text: string) => (
    <CustomFileInput
      className={theme.warningFallbackButton}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = (text: string) => (
    <FallbackButton
      text={text}
      onClick={() => this.props.changeFlowTo('crossDeviceSteps')}
    />
  )

  render() {
    const {
      documentType,
      hasCamera,
      isPoA,
      poaDocumentType,
      side,
      translate,
      uploadFallback,
      useLiveDocumentCapture,
      useWebcam,
    } = this.props

    if (!side) {
      trackException(EXCEPTIONS.CAPTURE_SIDE_NOT_PROVIDED)
      throw new Error(EXCEPTIONS.CAPTURE_SIDE_NOT_PROVIDED)
    }

    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[
        getDocumentType(isPoA, documentType, poaDocumentType)
      ][side]?.title || ''
    )
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle title={title} smaller />
    const renderFallback = isDesktop
      ? this.renderCrossDeviceFallback
      : this.renderUploadFallback
    const enableLiveDocumentCapture =
      useLiveDocumentCapture && (!isDesktop || isHybrid)

    if (hasCamera && useWebcam) {
      return (
        <DocumentAutoCapture
          {...propsWithErrorHandling}
          renderFallback={renderFallback}
          renderTitle={renderTitle}
          onValidCapture={this.handleCapture}
        />
      )
    }

    if (hasCamera && enableLiveDocumentCapture) {
      return (
        <DocumentLiveCapture
          {...propsWithErrorHandling}
          containerClassName={style.liveDocumentContainer}
          isUploadFallbackDisabled={!uploadFallback}
          onCapture={this.handleCapture}
          renderFallback={renderFallback}
          renderTitle={renderTitle}
        />
      )
    }

    // Different upload types show different icons
    // return the right icon name for document
    // For document, the upload can be 'identity' or 'proof_of_address'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType)
    const instructions = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[
        getDocumentType(isPoA, documentType, poaDocumentType)
      ][side]?.body || ''
    )

    return (
      <Uploader
        {...propsWithErrorHandling}
        uploadType={uploadType}
        onUpload={this.handleUpload}
        title={title}
        instructions={instructions}
      />
    )
  }
}

export default appendToTracking(
  localised(withCrossDeviceWhenNoCamera(Document))
)
