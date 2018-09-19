import { h, Component } from 'preact'
import Tree, { Leaf } from '../Tree'
import { FaceCapture, LivenessCapture } from '../Capture'
import { FaceConfirm, LivenessConfirm } from '../Confirm'
import LivenessIntro from '../Liveness/Intro'
import { map } from '../utils/object'

const shouldUseLiveness = steps => {
  const { options: faceOptions } = Array.find(steps, ({ type }) => type === 'face') || {}
  return (faceOptions || {}).requestedVariant === 'video' && window.MediaRecorder
}

export default function FaceJourney(props) {
  return  (
    <Tree>{
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
          <Leaf path={path} key={path}>
            <Component {...props} />
          </Leaf>
        )
    }
    </Tree>
  )
}

