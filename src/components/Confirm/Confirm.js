import { h, Component } from 'preact'
import { trackException, sendEvent } from '../../Tracker'
import { withBlobPreviewUrl, withBlobBase64 } from './CaptureViewer/hocs'
import { isOfMimeType } from '~utils/blob'
import {
  uploadDocument,
  uploadLivePhoto,
  uploadLiveVideo,
  sendMultiframeSelfie,
} from '~utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Spinner from '../Spinner'
import Previews from './Previews'
import * as d3 from 'd3'

const MAX_RETRIES_FOR_IMAGE_QUALITY = 2

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      capture: null,
    }
  }

  setError = (name) => {
    this.setState({ error: { name, type: 'error' }, uploadInProgress: false })
    this.props.resetSdkFocus()
  }

  setWarning = (name) => {
    this.setState({ error: { name, type: 'warn' }, uploadInProgress: false })
    this.props.resetSdkFocus()
  }

  onfidoErrorFieldMap = ([key, val]) => {
    if (key === 'document_detection') return 'INVALID_CAPTURE'
    // on corrupted PDF or other unsupported file types
    if (key === 'file') return 'INVALID_TYPE'
    // hit on PDF/invalid file type submission for face detection
    if (key === 'attachment' || key === 'attachment_content_type')
      return 'UNSUPPORTED_FILE'
    if (key === 'face_detection') {
      return val[0].indexOf('Multiple faces') === -1
        ? 'NO_FACE_ERROR'
        : 'MULTIPLE_FACES_ERROR'
    }
    // return a generic error if the status is 422 and the key is none of the above
    return 'REQUEST_ERROR'
  }

  onfidoErrorReduce = ({ fields }) => {
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first
  }

  componentDidUpdate() {
    console.log(`D3 version on update CONFIRM: ${d3.version}`)

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max))
    }

    const randn_bm = () => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
      return num;
    }

    this.container && this.container.focus()
    console.log(this.props.capture.blob)

    const svg = d3.select('.manel')
      .append('svg')
      .attr('width', 400)
      .attr('height', 400)

    // svg.style("background","url('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRcajTNBolJY-frdf6PrVVudBeKPsMtF8YCuw&usqp=CAU') no-repeat")

    const reader = new FileReader();
    reader.addEventListener('load', function () {
      // console.log(reader.result)
      d3.select(".jakim").attr('src', reader.result)
    // svg.style("background","url('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRcajTNBolJY-frdf6PrVVudBeKPsMtF8YCuw&usqp=CAU') no-repeat")
    }, false);


    reader.readAsDataURL(this.props.capture.blob)
    // svg.style('background', reader.readAsDataURL(this.props.capture.blob).result)
    svg.style('background-size','100% 100%')
    svg.style('position','absolute')
    svg.style('top','0')
    svg.style('left','0')

    const insertCircle = (svg, x, y) => {
      let r = Math.random().toString(36).substring(7);

      svg.append('circle')
        .attr('id', 'my-circle' + r)
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', '2')
        .attr('stroke', 'green')
        .attr('stroke-width', '2')
        .attr('opacity', '0.3')

      svg.append('animate')
        .attr('xlink:href','#my-circle' + r)
        .attr('attributeName','cx')
        .attr('from', x)
        .attr('to', 300)
        .attr('dur', '5s')
        .attr('repeatCount','indefinite')

      const new_x = randn_bm()*300
      svg.append('circle')
        .attr('id', 'my-leftover-circle' + r)
        .attr('cx', new_x)
        .attr('cy', y)
        .attr('r', '5')
        .attr('stroke', 'green')
        .attr('stroke-width', '4')
        .attr('fill', 'rgba(85, 109, 107, 0.61)')
        .attr('opacity', '0')

      svg.append('animate')
        .attr('xlink:href','#my-leftover-circle' + r)
        .attr('attributeName','opacity')
        .attr('values', '0 ; 1 ; 0.9; 0')
        .attr('calcMode', 'discrete')
        .attr('repeatCount','indefinite')
        .attr('dur','5s')
        .attr('keyTimes','0 ; ' + ((5.0*new_x)/300) / 5 + ' ; ' + ((5.0*(new_x+30))/300) / 5 + '; 1')

      svg.append('animate')
        .attr('xlink:href','#my-circle' + r)
        .attr('attributeName','r')
        .attr('values', '0 ; 6 ; 4; 0')
        // .attr('calcMode', 'discrete')
        .attr('repeatCount','indefinite')
        .attr('dur','5s')
        .attr('keyTimes','0 ; ' + ((5.0*new_x)/300) / 5 + ' ; ' + ((5.0*(new_x+30))/300) / 5 + '; 1')

      svg.append('animate')
        .attr('xlink:href','#my-circle' + r)
        .attr('attributeName','cy')
        .attr('from', y)
        .attr('to', y)
        .attr('dur', '5s')
        .attr('repeatCount','indefinite')
    }

    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)
    insertCircle(svg, 0, randn_bm()*400)

    svg.append('line')
      .attr('id', 'my-line-green')
      .attr('x1', 2)
      .attr('y1', 0)
      .attr('x2', 10)
      .attr('y2', 400)
      .attr('stroke', 'green')
      .attr('stroke-width', '5')
      .attr('opacity', '0.5')

    svg.append('animate')
      .attr('xlink:href','#my-line-green')
      .attr('attributeName','x1')
      .attr('from', 2)
      .attr('to', 300)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    svg.append('animate')
      .attr('xlink:href','#my-line-green')
      .attr('attributeName','x2')
      .attr('from', 2)
      .attr('to', 300)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    svg.append('line')
      .attr('id', 'my-line-grey')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 10)
      .attr('y2', 400)
      .attr('stroke', '#b6b9bf')
      .attr('stroke-width', '4')
      .attr('opacity', '0.7')

    svg.append('animate')
      .attr('xlink:href','#my-line-grey')
      .attr('attributeName','x1')
      .attr('from', 0)
      .attr('to', 300)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    svg.append('animate')
      .attr('xlink:href','#my-line-grey')
      .attr('attributeName','stroke')
      .attr('from', '#b6b9bf')
      .attr('to', '#9599a1')
      .attr('dur', '0.2s')
      .attr('repeatCount','indefinite')

    svg.append('animate')
      .attr('xlink:href','#my-line-grey')
      .attr('attributeName','x2')
      .attr('from', 0)
      .attr('to', 300)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    const rect = svg.append('rect')
      .attr('xlink:href','my-rect')
      .attr('width', 300)
      .attr('height', 400)
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'rgb(20,20,20)')
      .style('fill-opacity', 1)

    rect.append('animate')
      .attr('attributeName','x')
      .attr('from', 0)
      .attr('to', 300)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    rect.append('animate')
      .attr('attributeName','fill-opacity')
      .attr('from', 1)
      .attr('to', 0)
      .attr('dur', '20s')
      .attr('repeatCount','indefinite')

    rect.append('animate')
      .attr('attributeName','width')
      .attr('from', 300)
      .attr('to', 0)
      .attr('dur', '5s')
      .attr('repeatCount','indefinite')

    console.log(this.props.capture.blob)
  }

  onApiError = (error) => {
    let errorKey
    const status = error.status || ''
    const response = error.response || {}

    if (this.props.mobileFlow && status === 401) {
      this.props.triggerOnError({ status, response })
      return this.props.crossDeviceClientError()
    } else if (status === 422) {
      errorKey = this.onfidoErrorReduce(response.error)
    } else {
      this.props.triggerOnError({ status, response })
      trackException(`${status} - ${response}`)
      errorKey = 'REQUEST_ERROR'
    }

    this.setError(errorKey)
  }

  onApiSuccess = (apiResponse) => {
    const { method, nextStep, actions } = this.props
    const { capture } = this.state

    const duration = Math.round(performance.now() - this.startTime)
    sendEvent('Completed upload', { duration, method })

    actions.setCaptureMetadata({ capture, apiResponse })

    const imageQualityWarning = this.getImageQualityWarningFromResponse(
      apiResponse
    )

    if (!imageQualityWarning) {
      // wait a tick to ensure the action completes before progressing
      setTimeout(nextStep, 0)
    } else {
      this.setWarning(imageQualityWarning)
    }
  }

  getImageQualityWarningFromResponse = (apiResponse) => {
    const { sdk_warnings: warnings } = apiResponse

    if (!warnings) {
      return null
    }

    if (warnings.detect_cutoff && !warnings.detect_cutoff.valid) {
      return 'CUT_OFF_DETECTED'
    }

    if (warnings.detect_glare && !warnings.detect_glare.valid) {
      return 'GLARE_DETECTED'
    }

    if (warnings.detect_blur && !warnings.detect_blur.valid) {
      return 'BLUR_DETECTED'
    }

    // Not interested in any other warnings
    return null
  }

  handleSelfieUpload = ({ snapshot, ...selfie }, token) => {
    const url = this.props.urls.onfido_api_url
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      sendMultiframeSelfie(
        snapshot,
        selfie,
        token,
        url,
        this.onApiSuccess,
        this.onApiError,
        sendEvent
      )
    } else {
      const { blob, filename, sdkMetadata } = selfie
      // filename is only present for images taken via webcam.
      // Captures that have been taken via the Uploader component do not have filename
      // and the blob is a File type
      const filePayload = filename ? { blob, filename } : blob
      uploadLivePhoto(
        { file: filePayload, sdkMetadata },
        url,
        token,
        this.onApiSuccess,
        this.onApiError
      )
    }
  }

  getIssuingCountry = () => {
    const { idDocumentIssuingCountry, poaDocumentType, country } = this.props
    const isPoA = poaDocumentTypes.includes(poaDocumentType)
    if (isPoA) {
      return { issuing_country: country || 'GBR' }
    }
    if (idDocumentIssuingCountry && idDocumentIssuingCountry.country_alpha3) {
      return { issuing_country: idDocumentIssuingCountry.country_alpha3 }
    }
    return {}
  }

  uploadCaptureToOnfido = () => {
    const {
      urls,
      capture,
      method,
      side,
      token,
      poaDocumentType,
      language,
    } = this.props
    const url = urls.onfido_api_url
    this.startTime = performance.now()
    sendEvent('Starting upload', { method })
    this.setState({ uploadInProgress: true })
    const {
      blob,
      documentType: type,
      variant,
      challengeData,
      sdkMetadata,
    } = capture
    this.setState({ capture })

    if (method === 'document') {
      const isPoA = poaDocumentTypes.includes(poaDocumentType)
      const shouldWarnForImageQuality = !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { detect_document: 'error' } : {}),
        ...(shouldWarnForImageQuality
          ? {
              detect_cutoff: 'warn',
              detect_glare: 'warn',
              detect_blur: 'warn',
            }
          : {}),
      }
      const issuingCountry = this.getIssuingCountry()
      // API does not support 'residence_permit' type but does accept 'unknown'
      // See https://documentation.onfido.com/#document-types
      const data = {
        file: blob,
        type: type === 'residence_permit' ? 'unknown' : type,
        side,
        validations,
        sdkMetadata,
        ...issuingCountry,
      }
      uploadDocument(data, url, token, this.onApiSuccess, this.onApiError)
    } else if (method === 'face') {
      if (variant === 'video') {
        const data = { challengeData, blob, language, sdkMetadata }
        uploadLiveVideo(data, url, token, this.onApiSuccess, this.onApiError)
      } else {
        this.handleSelfieUpload(capture, token)
      }
    }
  }

  onRetake = () => {
    const { actions, previousStep } = this.props

    // Retake on warning, increase image quality retries
    if (this.state.error.type === 'warn') {
      actions.retryForImageQuality()
    }

    previousStep()
  }

  onConfirm = () => {
    if (this.state.error.type === 'warn') {
      this.props.actions.resetImageQualityRetries()
      this.props.nextStep()
    } else {
      this.uploadCaptureToOnfido()
    }
  }

  render = ({
    capture,
    method,
    documentType,
    poaDocumentType,
    isFullScreen,
    imageQualityRetries,
  }) => {
    const { error, uploadInProgress } = this.state

    if (uploadInProgress) {
      return <Spinner />
    }

    return (
      <Previews
        isFullScreen={isFullScreen}
        capture={capture}
        retakeAction={this.onRetake}
        confirmAction={this.onConfirm}
        isUploading={uploadInProgress}
        error={error}
        method={method}
        documentType={documentType}
        poaDocumentType={poaDocumentType}
        forceRetake={
          error.type === 'error' ||
          (error.type === 'warn' &&
            imageQualityRetries < MAX_RETRIES_FOR_IMAGE_QUALITY)
        }
      />
    )
  }
}

export default Confirm
