import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import { SelectPoADocument } from '../Select'
import { FrontDocumentCapture } from '../Capture'
import { DocumentFrontConfirm } from '../Confirm'
import { PoAIntro, Guidance } from './index'
import { map } from '../utils/object'

export default function PoAFlow(props) {
  return (
    <Flow name="poa">{
      map({
        'intro': PoAIntro,
        'select': SelectPoADocument,
        'guidance': Guidance,
        'capture': FrontDocumentCapture,
        'confirm': DocumentFrontConfirm,
      }, (Component, key) =>
        <Step key={key}>
          <Component {...props} />
        </Step>
      )
    }
    </Flow>
  )
}
