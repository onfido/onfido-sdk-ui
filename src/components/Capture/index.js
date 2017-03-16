import { h, Component } from 'preact'
import Capture from './capture.js'
import { impurify } from '../utils'

const StatelessFrontDocumentCapture = options =>
  <Capture autoCapture={true} {...options} />

StatelessFrontDocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document',
  side: 'front'
}

const StatelessBackDocumentCapture = options =>
  <Capture autoCapture={true} {...options} />

StatelessBackDocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document',
  side: 'back'
}

const StatelessFaceCapture = options =>
  <Capture autoCapture={false} {...options} />

StatelessFaceCapture.defaultProps = {
  useWebcam: true,
  method: 'face',
  side: null
}

//TODO investigate this workaround of wrapping stateless components.
// It may be to do with preact vs react.
export const FrontDocumentCapture = impurify(StatelessFrontDocumentCapture)
export const BackDocumentCapture = impurify(StatelessBackDocumentCapture)
export const FaceCapture = impurify(StatelessFaceCapture)
