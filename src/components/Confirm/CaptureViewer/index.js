import { h } from 'preact'
import { isOfMimeType } from '~utils/blob'
import PdfViewer from './PdfViewer'
import CaptureImageViewer from './CaptureImageViewer'
import CaptureVideoViewer from './CaptureVideoViewer'

const CaptureViewer = ({ capture: { blob, id, variant }, method, isFullScreen, altTag }) => {
  if (isOfMimeType(['pdf'], blob))
    return <PdfViewer blob={blob} altTag={altTag} />
  else if (variant === 'video')
    return <CaptureVideoViewer blob={blob} />

  return <CaptureImageViewer
    blob={blob}
    id={id}
    isDocument={method === 'document'}
    isFullScreen={isFullScreen}
    altTag={altTag}
  />
}

export default CaptureViewer
