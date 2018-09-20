import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import { SelectIdentityDocument } from '../Select'
import { FrontDocumentCapture, BackDocumentCapture } from '../Capture'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'
import { map } from '../utils/object'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

export default function DocumentFlow(props) {
  const isDoubleSided = Array.includes(doubleSidedDocs, props.documentType)
  return (
    <Flow>
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
    </Flow>
  )
}
