import { h, createElement } from 'preact'
import Steps, { Step } from '../Steps'
import Welcome from '../Welcome'
import Complete from '../Complete'
import ClientSuccess from '../crossDevice'
import DocumentJourney from './DocumentJourney'
import FaceJourney from './FaceJourney'
import PoAJourney from './PoAJourney'

const doubleSidedDocs = ['driving_licence', 'national_identity_card']

const withCompleteStep = steps =>
  !steps.some(({ type }) => type === 'complete') ?
    [...steps, { type: 'complete' }] :
    steps

export default function CaptureJourney(props) {
  const { steps, mobileFlow } = props
  const stepTypeComponent = {
    welcome: Welcome,
    document: DocumentJourney,
    face: FaceJourney,
    poa: PoAJourney,
    complete: mobileFlow ? ClientSuccess : Complete,
  }

  return (
    <Steps>
      {
        withCompleteStep(steps).map(({ type }, index) =>
          <Step path={ type } key={ type }>{
            createElement(stepTypeComponent[type], {...props })
          }
          </Step>
        )
      }
    </Steps>
  )
}


  
