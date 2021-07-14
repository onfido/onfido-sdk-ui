import { h, FunctionComponent } from 'preact'
import { isOfMimeType } from '~utils/blob'
import PdfViewer from './PdfViewer'
import CaptureImageViewer from './CaptureImageViewer'
import CaptureVideoViewer from './CaptureVideoViewer'

import type { CaptureMethods } from '~types/commons'
import type { CapturePayload } from '~types/redux'

type Props = {
  className?: string
  capture: CapturePayload
  method: CaptureMethods
  isFullScreen?: boolean
  imageAltTag?: string
  videoAriaLabel?: string
}

const CaptureViewer: FunctionComponent<Props> = ({
  className,
  capture: { blob, id, variant, isPreviewCropped },
  method,
  isFullScreen,
  imageAltTag,
  videoAriaLabel = 'Video preview',
}) => {
  if (isOfMimeType(['pdf'], blob)) {
    return <PdfViewer blob={blob} />
  }

  if (variant === 'video') {
    return (
      <CaptureVideoViewer
        ariaLabel={videoAriaLabel}
        blob={blob}
        className={className}
      />
    )
  }

  return (
    <CaptureImageViewer
      blob={blob}
      id={id}
      isDocument={method === 'document'}
      isPreviewCropped={isPreviewCropped}
      isFullScreen={isFullScreen}
      altTag={imageAltTag}
    />
  )
}

export default CaptureViewer
