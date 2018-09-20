import { h, Component } from 'preact'
import Steps, { Step } from '../Steps'
import { SelectPoADocument } from '../Select'
import { FrontDocumentCapture } from '../Capture'
import { DocumentFrontConfirm } from '../Confirm'
import { PoAIntro, PoAGuidance } from '../ProofOfAddress'
import { map } from '../utils/object'

export default function PoAJourney(props) {
  return  (
    <Steps>{
      map({
        'intro': PoAIntro,
        'select': SelectPoADocument,
        'guidance': PoAGuidance,
        'capture': FrontDocumentCapture,
        'confirm': DocumentFrontConfirm,
      }, (Component, path) =>
        <Step path={path} key={path}>
          <Component {...props} />
        </Step>
      )
    }
    </Steps>
  )
}
