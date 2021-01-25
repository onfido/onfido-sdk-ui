import { h, FunctionComponent } from 'preact'
import { useCallback, useState } from 'preact/compat'

import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { localised } from '../../locales'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import PageTitle from '../PageTitle'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { HandleCaptureProp, RenderFallbackProp } from '~types/routers'
import type { DocumentTypes } from '~types/steps'

type CaptureStep = 'front' | 'video' | 'back'

export type DocumentVideoProps = {
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
} & WithTrackingProps

type Props = DocumentVideoProps & WithLocalisedProps

const DocumentVideo: FunctionComponent<Props> = ({
  documentType,
  renderFallback,
  translate,
  trackScreen,
}) => {
  const [step, setStep] = useState<CaptureStep>('front')

  const handlePhotoCapture = useCallback<HandleCaptureProp>(
    (payload) => {
      console.log('handlePhotoCapture.payload:', step, payload)
      setStep('video')
    },
    [step]
  )

  if (step === 'front' || step === 'back') {
    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[documentType][step].title
    )

    return (
      <DocumentLiveCapture
        isUploadFallbackDisabled
        onCapture={handlePhotoCapture}
        renderFallback={renderFallback}
        renderTitle={<PageTitle title={title} smaller />}
        trackScreen={trackScreen}
      />
    )
  }

  return <div>Video capture for {documentType}</div>
}

export default localised(DocumentVideo)
