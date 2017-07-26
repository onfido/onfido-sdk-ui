import { h, Component } from 'preact'
import Capture from './capture.js'

const FrontDocumentCapture = options =>
  <Capture autoCapture={true} {...options} />

FrontDocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document',
  side: 'front'
}

const BackDocumentCapture = options =>
  <Capture autoCapture={true} {...options} />

BackDocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document',
  side: 'back'
}

const FaceCapture = options =>
  <Capture autoCapture={false} {...options} />

FaceCapture.defaultProps = {
  useWebcam: true,
  method: 'face',
  side: null
}

export default {
  FrontDocumentCapture,
  BackDocumentCapture,
  FaceCapture
}
