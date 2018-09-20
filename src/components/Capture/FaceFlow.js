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
    <Flow>{
      map(shouldUseLiveness(props.steps) ?
        {
          'intro': LivenessIntro,
          'capture': LivenessCapture,
          'confirm': LivenessConfirm,
        } :
        {
          'face': FaceCapture,
          'confirm': FaceConfirm,
        }, (Component, path) =>
          <Step path={path} key={path}>
            <Component {...props} />
          </Step>
        )
    }
    </Flow>
  )
}

