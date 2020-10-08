import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { isDesktop, isHybrid, addDeviceRelatedProperties } from '~utils'
import { compose } from '~utils/func'
import { randomId } from '~utils/string'
import { localised } from '../../locales'
import FallbackButton from '../Button/FallbackButton'
import style from './style.scss'

const LOCALES_MAPPING = {
  passport: {
    front: {
      title: 'doc_submit.title_passport',
      body: 'photo_upload.body_passport',
    },
  },
  driving_licence: {
    front: {
      title: 'doc_submit.title_licence_front',
      body: 'photo_upload.body_license_front',
    },
    back: {
      title: 'doc_submit.title_licence_back',
      body: 'photo_upload.body_license_back',
    },
  },
  national_identity_card: {
    front: {
      title: 'doc_submit.title_id_front',
      body: 'photo_upload.body_id_front',
    },
    back: {
      title: 'doc_submit.title_id_back',
      body: 'photo_upload.body_id_back',
    },
  },
  residence_permit: {
    front: {
      title: 'doc_submit.title_permit_front',
      body: 'photo_upload.body_permit_front',
    },
    back: {
      title: 'doc_submit.title_permit_back',
      body: 'photo_upload.body_permit_back',
    },
  },
  bank_building_society_statement: {
    front: {
      title: 'doc_submit.title_bank_statement',
      body: 'photo_upload.body_bank_statement',
    },
  },
  utility_bill: {
    front: {
      title: 'doc_submit.title_bill',
      body: 'photo_upload.body_bill',
    },
  },
  council_tax: {
    front: {
      title: 'doc_submit.title_tax_letter',
      body: 'photo_upload.body_tax_letter',
    },
  },
  benefit_letters: {
    front: {
      title: 'doc_submit.title_benefits_letter',
      body: 'photo_upload.body_benefits_letter',
    },
  },
  government_letter: {
    front: {
      title: 'doc_submit.title_government_letter',
      body: 'photo_upload.body_government_letter',
    },
  },
}

class Document extends Component {
  static defaultProps = {
    side: 'front',
    forceCrossDevice: false,
  }

  handleCapture = (payload) => {
    const {
      isPoA,
      documentType,
      poaDocumentType,
      actions,
      side,
      nextStep,
      mobileFlow,
    } = this.props
    const documentCaptureData = {
      ...payload,
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      method: 'document',
      documentType: isPoA ? poaDocumentType : documentType,
      side,
      id: payload.id || randomId(),
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleUpload = (blob) =>
    this.handleCapture({ blob, sdkMetadata: { captureMethod: 'html5' } })

  handleError = () => this.props.actions.deleteCapture()

  renderUploadFallback = (text) => (
    <CustomFileInput
      className={style.uploadFallback}
      onChange={this.handleUpload}
      accept="image/*"
      capture
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = (text) => (
    <FallbackButton
      text={text}
      onClick={() => this.props.changeFlowTo('crossDeviceSteps')}
    />
  )

  render() {
    const {
      useLiveDocumentCapture,
      useWebcam,
      hasCamera,
      documentType,
      poaDocumentType,
      isPoA,
      side,
      translate,
      subTitle,
      uploadFallback,
    } = this.props

    const title = translate(
      LOCALES_MAPPING[isPoA ? poaDocumentType : documentType][side].title
    )
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle {...{ title, subTitle }} smaller />
    const renderFallback = isDesktop
      ? this.renderCrossDeviceFallback
      : this.renderUploadFallback
    const enableLiveDocumentCapture =
      useLiveDocumentCapture && (!isDesktop || isHybrid)

    if (hasCamera && useWebcam) {
      return (
        <DocumentAutoCapture
          {...propsWithErrorHandling}
          renderTitle={renderTitle}
          renderFallback={renderFallback}
          containerClassName={style.documentContainer}
          onValidCapture={this.handleCapture}
        />
      )
    }

    if (hasCamera && enableLiveDocumentCapture) {
      return (
        <DocumentLiveCapture
          {...propsWithErrorHandling}
          renderTitle={renderTitle}
          renderFallback={renderFallback}
          containerClassName={style.liveDocumentContainer}
          onCapture={this.handleCapture}
          isUploadFallbackDisabled={!uploadFallback}
        />
      )
    }

    // Different upload types show different icons
    // return the right icon name for document
    // For document, the upload can be 'identity' or 'proof_of_address'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType)
    const instructions = translate(
      LOCALES_MAPPING[isPoA ? poaDocumentType : documentType][side].body
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

export default compose(
  appendToTracking,
  localised,
  withCrossDeviceWhenNoCamera
)(Document)
