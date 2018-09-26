import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import { FaceCapture, VideoCapture } from './index'
import { FaceConfirm, VideoConfirm } from '../Confirm'
import VideoIntro from '../Video/Intro'
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
          'intro': VideoIntro,
          'capture': VideoCapture,
          'confirm': VideoConfirm,
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

