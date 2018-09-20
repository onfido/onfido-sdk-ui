import { h, Component } from 'preact'
import Steps, { Step } from '../Steps'
import { SelectIdentityDocument } from '../Select'
import { FrontDocumentCapture, BackDocumentCapture } from '../Capture'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'
import { map } from '../utils/object'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

export default function DocumentJourney(props) {
  const isDoubleSided = Array.includes(doubleSidedDocs, props.documentType)
  return (
    <Steps>
    {
      map({
        'select': SelectIdentityDocument,
        'front': FrontDocumentCapture,
        'front-confirm': DocumentFrontConfirm,
        ...(isDoubleSided ? {
          'back': BackDocumentCapture,
          'back-confirm': DocumentBackConfirm,
        } : {})
      }, (Component, path) =>
        <Step path={path} key={path}>
          <Component {...props} />
        </Step>
      )
    }
    </Steps>
  )
}
