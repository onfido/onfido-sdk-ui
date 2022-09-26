import { StepConfigDocument } from '~types/steps'
import { isDesktop, isHybrid } from '~utils'

export const shouldUseCameraForDocumentCapture = (
  documentStep?: StepConfigDocument,
  deviceHasCameraSupport?: boolean
): boolean => {
  const canUseLiveDocumentCapture =
    (!isDesktop || isHybrid) && documentStep?.options?.useLiveDocumentCapture

  return (
    (canUseLiveDocumentCapture || documentStep?.options?.useWebcam === true) &&
    deviceHasCameraSupport === true
  )
}
