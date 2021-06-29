import { h } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import CaptureViewer from '../CaptureViewer'
import Actions from './Actions'
import PageTitle from '../PageTitle'
import Error from '../Error'
import { CONFIRM_PREVIEWS_LOCALES_MAPPING } from '~utils/localesMapping'
import theme from '../Theme/style.scss'
import style from './style.scss'
import ScreenLayout from '../Theme/ScreenLayout'

const getMessageKey = ({
  capture,
  documentType,
  poaDocumentType,
  error,
  forceRetake,
  method,
}) => {
  if (method === 'face') {
    return capture.variant === 'video' ? null : 'selfie_confirmation.subtitle'
  }

  // In case of real error encountered but there's a `forceRetake` flag activated
  if (error && error.type === 'error') {
    return CONFIRM_PREVIEWS_LOCALES_MAPPING[documentType || poaDocumentType]
  }

  if (forceRetake) {
    return 'doc_confirmation.body_image_poor'
  }

  if (error && error.type === 'warn') {
    return 'doc_confirmation.body_image_medium'
  }

  return CONFIRM_PREVIEWS_LOCALES_MAPPING[documentType || poaDocumentType]
}

const getNamespace = (method, variant) => {
  if (method === 'face') {
    if (variant === 'video') {
      return 'video_confirmation'
    }

    return 'selfie_confirmation'
  }

  return 'doc_confirmation'
}

const Previews = localised(
  ({
    capture,
    retakeAction,
    confirmAction,
    error,
    method,
    documentType,
    poaDocumentType,
    translate,
    isFullScreen,
    isUploading,
    forceRetake,
  }) => {
    const methodNamespace = getNamespace(method, capture.variant)
    /**
     * Possible locale keys for `title`:
     *  - doc_confirmation.title
     *  - selfie_confirmation.title
     *  - video_confirmation.title
     */
    const title = translate(`${methodNamespace}.title`)

    /**
     * Possible locale keys for `imageAltTag`:
     *  - doc_confirmation.image_accessibility
     *  - selfie_confirmation.image_accessibility
     */
    const imageAltTag = translate(`${methodNamespace}.image_accessibility`)
    const videoAriaLabel = translate('video_confirmation.video_accessibility')
    const message = translate(
      getMessageKey({
        capture,
        documentType,
        poaDocumentType,
        error,
        forceRetake,
        method,
      })
    )
    const actions = (
      <Actions
        {...{
          retakeAction,
          confirmAction,
          isUploading,
          error,
          forceRetake,
        }}
      />
    )
    return (
      <ScreenLayout actions={!isFullScreen && actions}>
        <div
          className={classNames(
            style.previewsContainer,
            theme.fullHeightContainer,
            {
              [style.previewsContainerIsFullScreen]: isFullScreen,
            }
          )}
        >
          {isFullScreen ? null : error.type ? (
            <Error
              {...{
                error,
                withArrow: true,
                role: 'alert',
                focusOnMount: false,
              }}
            />
          ) : (
            <PageTitle title={title} smaller={true} className={style.title} />
          )}
          <CaptureViewer
            {...{ capture, method, isFullScreen, imageAltTag, videoAriaLabel }}
          />
          <div style={{ color: '#f00', border: '#f00' }}>
            <div>
              DEBUG - file size: {capture.blob.size} bytes ({capture.blob.type})
            </div>
            <div>
              DEBUG - SDK capture method:
              <br />
              {JSON.stringify(capture.sdkMetadata.captureMethod)}
            </div>
            <div>
              DEBUG - camera video stream settings:
              <br />
              {JSON.stringify(capture.sdkMetadata.camera_settings)}
            </div>
            <div>
              DEBUG - image resized:{' '}
              {capture.sdkMetadata.imageResizeInfo ? 'true' : 'false'}
            </div>
            <div>
              DEBUG - device ({capture.sdkMetadata.deviceType}):
              <br />
              {JSON.stringify(capture.sdkMetadata.system)}
            </div>
          </div>
        </div>
        {!isFullScreen && <p className={style.message}>{message}</p>}
      </ScreenLayout>
    )
  }
)

export default Previews
