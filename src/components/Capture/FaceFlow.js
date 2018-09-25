import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import { FaceCapture, LivenessCapture } from '../Capture'
import { FaceConfirm, LivenessConfirm } from '../Confirm'
import LivenessIntro from '../Liveness/Intro'
import { map } from '../utils/object'

const shouldUseLiveness = steps => {
  const { options: faceOptions } = Array.find(steps, ({ type }) => type === 'face') || {}
  return (faceOptions || {}).requestedVariant === 'video' && window.MediaRecorder
}

export default function FaceFlow(props) {
  return  (
    <Flow name="face">{
      map(shouldUseLiveness(props.steps) ?
        {
          'intro': LivenessIntro,
          'capture': LivenessCapture,
          'confirm': LivenessConfirm,
        } :
        {
          'face': FaceCapture,
          'confirm': FaceConfirm,
        }, (Component, key) =>
          <Step key={key}>
            <Component {...props} />
          </Step>
        )
    }
    </Flow>
  )
}

