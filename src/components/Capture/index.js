import { h, Component } from 'preact'
import Capture from './capture.js'
import { impurify } from '../utils'

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

//TODO investigate this workaround of wrapping stateless components.
// It may be to do with preact vs react.
export default {
  FrontDocumentCapture: impurify(FrontDocumentCapture),
  BackDocumentCapture: impurify(BackDocumentCapture),
  FaceCapture: impurify(FaceCapture)
}
