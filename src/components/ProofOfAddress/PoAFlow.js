import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import { SelectPoADocument } from '../Select'
import { FrontDocumentCapture } from '../Capture'
import { DocumentFrontConfirm } from '../Confirm'
import { PoAIntro, PoAGuidance } from './index'
import { map } from '../utils/object'

export default function PoAFlow(props) {
  return (
    <Flow>{
      map({
        'intro': PoAIntro,
        'select': SelectPoADocument,
        'guidance': PoAGuidance,
        'capture': FrontDocumentCapture,
        'confirm': DocumentFrontConfirm,
      }, (Component, pathname) =>
        <Step pathname={pathname} key={pathname}>
          <Component {...props} />
        </Step>
      )
    }
    </Flow>
  )
}
