import { h, Component } from 'preact'
import Tree, { Leaf } from '../Tree'
import { SelectPoADocument } from '../Select'
import { FrontDocumentCapture } from '../Capture'
import { DocumentFrontConfirm } from '../Confirm'
import { PoAIntro, PoAGuidance } from '../ProofOfAddress'
import { map } from '../utils/object'

export default function PoAJourney(props) {
  return  (
    <Tree>{
      map({
        'intro': PoAIntro,
        'select': SelectPoADocument,
        'guidance': PoAGuidance,
        'capture': FrontDocumentCapture,
        'confirm': DocumentFrontConfirm,
      }, (Component, path) =>
        <Leaf path={path} key={path}>
          <Component {...props} />
        </Leaf>
      )
    }
    </Tree>
  )
}
