import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { withBlobPreviewUrl, withBlobBase64 } from './hocs'
import EnlargedPreview from '../EnlargedPreview'
import style from './style.scss'

import type { WithBlobPreviewProps } from '~types/hocs'

type CaptureImageViewerProps = {
  altTag?: string
  id?: string
  isDocument?: boolean
  isFullScreen?: boolean
  isPreviewCropped?: boolean
  src?: string
}

const CaptureImageViewer: FunctionComponent<CaptureImageViewerProps> = ({
  src,
  id,
  isDocument,
  isFullScreen,
  isPreviewCropped,
  altTag,
}) => (
  <span
    className={classNames(
      isPreviewCropped ? style.croppedImageWrapper : style.imageWrapper,
      {
        [style.fullscreenImageWrapper]: isFullScreen,
      }
    )}
  >
    {isDocument && (
      <EnlargedPreview
        {...{
          src,
          altTag,
        }}
      />
    )}
    {!isFullScreen && (
      <img
        key={id} //WORKAROUND necessary to prevent img recycling, see bug: https://github.com/developit/preact/issues/351
        className={isPreviewCropped ? style.croppedDocumentImage : style.image}
        //we use base64 if the capture is a File, since its base64 version is exif rotated
        //if it's not a File (just a Blob), it means it comes from the webcam,
        //so the base64 version is actually lossy and since no rotation is necessary
        //the blob is the best candidate in this case
        src={src}
        alt={altTag}
        aria-hidden={isDocument} // This prevents the image alt tag from being read twice for document as the document alt tag is already announced inside EnlargedPreview component
      />
    )}
  </span>
)

const CaptureImageViewerWithPreviewUrl = withBlobPreviewUrl(
  ({ previewUrl, ...props }) => (
    <CaptureImageViewer src={previewUrl} {...props} />
  )
)
const CaptureImageViewerWithBase64 = withBlobBase64(({ base64, ...props }) => (
  <CaptureImageViewer src={base64} {...props} />
))

const WrappedCaptureImageViewer: FunctionComponent<
  CaptureImageViewerProps & WithBlobPreviewProps
> = ({ blob, ...props }) =>
  blob instanceof File ? (
    <CaptureImageViewerWithBase64 blob={blob} {...props} />
  ) : (
    <CaptureImageViewerWithPreviewUrl blob={blob} {...props} />
  )

export default WrappedCaptureImageViewer
