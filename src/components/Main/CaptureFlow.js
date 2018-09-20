import { h, createElement } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import Welcome from '../Welcome'
import Complete from '../Complete'
import ClientSuccess from '../crossDevice'
import DocumentFlow from '../Capture/DocumentFlow'
import FaceFlow from '../Capture/FaceFlow'
import PoAFlow from '../ProofOfAddress/PoAFlow'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

const withCompleteStep = steps =>
  !steps.some(({ type }) => type === 'complete') ?
    [...steps, { type: 'complete' }] :
    steps

export default function CaptureFlow(props) {
  const { steps, mobileFlow } = props
  const stepTypeComponent = {
    welcome: Welcome,
    document: DocumentFlow,
    face: FaceFlow,
    poa: PoAFlow,
    complete: mobileFlow ? ClientSuccess : Complete,
  }

  return (
    <Flow>
      {
        withCompleteStep(steps).map(({ type }, index) =>
          <Step path={ type } key={ type }>{
            createElement(stepTypeComponent[type], {...props })
          }
          </Step>
        )
      }
    </Flow>
  )
}
