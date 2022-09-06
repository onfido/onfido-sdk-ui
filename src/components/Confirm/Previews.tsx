import { h } from 'preact'
import classNames from 'classnames'
import { useLocales } from '~locales'
import CaptureViewer from '../CaptureViewer'
import Actions from './Actions'
import PageTitle from '../PageTitle'
import Error from '../Error'
import { CONFIRM_PREVIEWS_LOCALES_MAPPING } from '~utils/localesMapping'
import theme from '../Theme/style.scss'
import style from './Previews.scss'
import ScreenLayout from '../Theme/ScreenLayout'
import { CaptureMethods } from '~types/commons'
import { DocumentTypes, PoaTypes, RequestedVariant } from '~types/steps'
import { CapturePayload } from '~types/redux'
import { ErrorProp } from '~types/routers'
import { TrackScreenCallback } from '~types/hocs'

const getMessageKey = ({
  capture,
  documentType,
  error,
  forceRetake,
  method,
}: Pick<
  PreviewsProps,
  'capture' | 'documentType' | 'error' | 'forceRetake' | 'method'
>) => {
  if (method === 'face') {
    return capture.variant === 'video' ? '' : 'selfie_confirmation.subtitle'
  }

  // In case of real error encountered but there's a `forceRetake` flag activated
  if (error?.type === 'error' && documentType) {
    return CONFIRM_PREVIEWS_LOCALES_MAPPING[documentType]
  }

  if (forceRetake) {
    return 'doc_confirmation.body_image_poor'
  }

  if (error?.type === 'warning') {
    return 'doc_confirmation.body_image_medium'
  }

  if (documentType) {
    return CONFIRM_PREVIEWS_LOCALES_MAPPING[documentType]
  }

  return ''
}

const getNamespace = (method: CaptureMethods, variant?: RequestedVariant) => {
  if (method === 'face') {
    if (variant === 'video') {
      return 'video_confirmation'
    }

    return 'selfie_confirmation'
  }

  return 'doc_confirmation'
}

type PreviewsProps = {
  isFullScreen: boolean
  capture: CapturePayload
  retakeAction: () => void
  confirmAction: () => void
  isUploading: boolean
  error?: ErrorProp
  method: CaptureMethods
  documentType?: DocumentTypes | PoaTypes
  forceRetake: boolean
  onVideoError: () => void
  trackScreen: TrackScreenCallback
}

const Previews = ({
  capture,
  retakeAction,
  confirmAction,
  error,
  method,
  documentType,
  isFullScreen,
  isUploading,
  forceRetake,
  onVideoError,
  trackScreen,
}: PreviewsProps) => {
  const { translate } = useLocales()

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
    <ScreenLayout actions={!isFullScreen ? actions : undefined}>
      <div
        className={classNames(
          style.previewsContainer,
          theme.fullHeightContainer,
          {
            [style.previewsContainerIsFullScreen]: isFullScreen,
          }
        )}
      >
        {error?.type && (
          <span style={isFullScreen ? { display: 'none' } : undefined}>
            <Error
              {...{
                error,
                withArrow: true,
                role: 'alert',
                focusOnMount: false,
                trackScreen,
              }}
            />
          </span>
        )}
        {!isFullScreen && !error?.type ? (
          <PageTitle
            title={title}
            smaller
            className={style.title}
            shouldAutoFocus={methodNamespace !== 'doc_confirmation'}
          />
        ) : null}
        <CaptureViewer
          {...{
            capture,
            method,
            isFullScreen,
            imageAltTag,
            videoAriaLabel,
            onVideoError,
            trackScreen,
          }}
        />
        {!isFullScreen && <p className={style.message}>{message}</p>}
      </div>
    </ScreenLayout>
  )
}

export default Previews
