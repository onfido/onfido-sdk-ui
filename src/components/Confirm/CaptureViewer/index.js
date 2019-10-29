import { h } from 'preact'
import { isOfMimeType } from '~utils/blob'
import PdfViewer from './PdfViewer'
import CaptureImageViewer from './CaptureImageViewer'
import CaptureVideoViewer from './CaptureVideoViewer'

const CaptureViewer = ({
  capture: { blob, id, variant, isPreviewCropped },
  method,
  isFullScreen,
  imageAltTag,
  videoAriaLabel
}) => {
  if (isOfMimeType(['pdf'], blob))
    return <PdfViewer blob={blob} />
  else if (variant === 'video')
    return <CaptureVideoViewer ariaLabel={videoAriaLabel} blob={blob} />

  return <CaptureImageViewer
    blob={blob}
    id={id}
    isDocument={method === 'document'}
    isPreviewCropped={isPreviewCropped}
    isFullScreen={isFullScreen}
    altTag={imageAltTag}
  />
}

export default CaptureViewer
