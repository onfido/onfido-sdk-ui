import { h, Component } from 'preact'
import Tree, { Leaf } from '../Tree'
import { SelectIdentityDocument } from '../Select'
import { FrontDocumentCapture, BackDocumentCapture } from '../Capture'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'
import { map } from '../utils/object'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

export default function DocumentJourney(props) {
  const isDoubleSided = Array.includes(doubleSidedDocs, props.documentType)
  return (
    <Tree>
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
        <Leaf path={path} key={path}>
          <Component {...props} />
        </Leaf>
      )
    }
    </Tree>
  )
}
