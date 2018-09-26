import { h, Component } from 'preact'
import Flow, { withFlowContext } from '../Flow'
import Step from '../Step'
import { SelectIdentityDocument } from '../Select'
import { FrontDocumentCapture, BackDocumentCapture } from './index'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'
import { map } from '../utils/object'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

export default function DocumentFlow(props) {
  const isDoubleSided = Array.includes(doubleSidedDocs, props.documentType)
  return (
    <Flow name="document">
    {
      map({
        'select': SelectIdentityDocument,
        'front': FrontDocumentCapture,
        'front-confirm': DocumentFrontConfirm,
        ...(isDoubleSided ? {
          'back': BackDocumentCapture,
          'back-confirm': DocumentBackConfirm,
        } : {})
      }, (Component, key) =>
        <Step key={key}>
          <Component {...props} />
        </Step>
      )
    }
    </Flow>
  )
}
