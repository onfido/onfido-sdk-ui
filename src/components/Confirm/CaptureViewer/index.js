import { h } from 'preact'
import { isOfFileType } from '~utils/blob'
import PdfViewer from './PdfViewer'
import CaptureImageViewer from './CaptureImageViewer'
import CaptureVideoViewer from './CaptureVideoViewer'

const CaptureViewer = ({ capture: { blob, id, variant }, method, isFullScreen }) => {
  if (isOfFileType(['pdf'], blob))
    return <PdfViewer blob={blob} />
  else if (variant === 'video')
    return <CaptureVideoViewer blob={blob} />

  return <CaptureImageViewer
    blob={blob}
    id={id}
    isDocument={method === 'document'}
    isFullScreen={isFullScreen}
  />
}

export default CaptureViewer
