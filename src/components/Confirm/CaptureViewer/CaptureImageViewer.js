import { h, Component } from 'preact'
import * as faceapi from 'face-api.js';
import classNames from 'classnames'
import style from './style.css'
import { withBlobPreviewUrl, withBlobBase64 } from './hocs'
import EnlargedPreview from '../../EnlargedPreview'

class CaptureImageViewer extends Component {
  constructor(props){
    super(props)
  }

  model = null

  state = {
    faceDetectionWarning: null,
    modelLoaded: false,
    detectingFace: false,
  }

  componentDidMount() {
    faceapi.nets.tinyFaceDetector.loadFromUri(`${process.env.PUBLIC_PATH || ''}/models`)
    .then(() => this.setState({modelLoaded: true}))
  }

  async componentDidUpdate() {
    if (this.state.modelLoaded && !this.state.detectingFace) {
      await this.startFaceDetection()
    }
  }

  setDetectionWarning = (faceDetectionWarning) => {
    this.setState({faceDetectionWarning})
  }

  handleDetections = (detections) => {
    if (!detections || detections.length < 1) {
      return this.setDetectionWarning('No face found')
    }
    else if (detections.length > 1) {
      return this.setDetectionWarning('Multiple faces detected')
    }
    this.setDetectionWarning('Face detected')
  }

  startFaceDetection = async () => {
    const { src } = this.props
    const image = new Image();
    image.src = src;
    this.setState({detectingFace: true})

    await faceapi.detectAllFaces(
      image,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.6 })
    ).then((results) => this.handleDetections(results))
  }

  render() {
    const { src, id, isDocument, isFullScreen, isPreviewCropped, altTag } = this.props;
    const { faceDetectionWarning } = this.state;

    return (
      <div>
    <span className={classNames(isPreviewCropped ? style.croppedImageWrapper : style.imageWrapper, {
      [style.fullscreenImageWrapper]: isFullScreen,
    })}>
      {
        isDocument &&
          <EnlargedPreview
            {...{
              src,
              altTag
            }}
          />
      }
      {
        !isFullScreen &&
          <img
            key={id}//WORKAROUND necessary to prevent img recycling, see bug: https://github.com/developit/preact/issues/351
            className={isPreviewCropped ? style.croppedDocumentImage : style.image}
            //we use base64 if the capture is a File, since its base64 version is exif rotated
            //if it's not a File (just a Blob), it means it comes from the webcam,
            //so the base64 version is actually lossy and since no rotation is necessary
            //the blob is the best candidate in this case
            src={src}
            alt={altTag}
            aria-hidden={isDocument} // This prevents the image alt tag from being read twice for document as the document alt tag is already announced inside EnlargedPreview component
          />
      }
    </span>
    { faceDetectionWarning && <div className={style.faceDetection}>{ faceDetectionWarning }</div> }
    </div>
  )}
}

const CaptureImageViewerWithPreviewUrl = withBlobPreviewUrl(
  ({ previewUrl, ...props }) => <CaptureImageViewer src={previewUrl} {...props} />
)
const CaptureImageViewerWithBase64 = withBlobBase64(
  ({ base64, ...props }) => <CaptureImageViewer src={base64} {...props} />
)

export default ({ blob, ...props }) => blob instanceof File
  ? <CaptureImageViewerWithBase64 blob={blob} {...props} />
  : <CaptureImageViewerWithPreviewUrl blob={blob} {...props} />
