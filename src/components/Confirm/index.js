import { h, Component } from 'preact'
import { events } from '../../core'
import theme from '../Theme/style.css'
import style from './style.css'
import classNames from 'classnames'
import { isOfFileType } from '../utils/file'
import {preventDefaultOnClick} from '../utils'
import PdfViewer from './PdfPreview'
import Error from '../Error'
import { trackComponent } from '../../Tracker'

const CaptureViewerPure = ({capture:{blob, base64, previewUrl}}) =>
  <div className={style.captures}>
    {isOfFileType(['pdf'], blob) ?
      <PdfViewer previewUrl={previewUrl} blob={blob}/> :
      <img className={style.image}
        //we use base64 if the capture is a File, since its base64 version is exif rotated
        //if it's not a File (just a Blob), it means it comes from the webcam,
        //so the base64 version is actually lossy and since no rotation is necessary
        //the blob is the best candidate in this case
        src={blob instanceof File ? base64 : previewUrl}
      />
    }
  </div>

class CaptureViewer extends Component {
  constructor (props) {
    super(props)
    const {capture:{blob}} = props
    this.state = this.previewUrlState(blob)
  }

  previewUrlState = blob =>
    blob ? { previewUrl: URL.createObjectURL(blob) } : {}

  updateBlobPreview(blob) {
    this.revokePreviewURL()
    this.setState(this.previewUrlState(blob))
  }

  revokePreviewURL(){
    URL.revokeObjectURL(this.state.previewUrl)
  }

  componentWillReceiveProps({capture:{blob}}) {
    if (this.props.capture.blob !== blob) this.updateBlobPreview(blob)
  }

  componentWillUnmount() {
    this.revokePreviewURL()
  }

  render () {
    const {capture} = this.props
    return <CaptureViewerPure
      capture={{
        ...capture,
        previewUrl: this.state.previewUrl
      }}/>
  }
}

const PreviewHeader = () =>
  <div>
    <h1 className={theme.title}>Confirm capture</h1>
    <p>Please confirm that you are happy with this photo.</p>
  </div>

const RetakeAction = ({retakeAction}) =>
  <button onClick={retakeAction}
    className={`${theme.btn} ${style["btn-outline"]}`}>
    Take again
  </button>

const ConfirmAction = ({confirmAction, error}) => {
  if (!error) return (
    <a href='#' className={`${theme.btn} ${theme["btn-primary"]}`}
      onClick={preventDefaultOnClick(confirmAction)}>
      Confirm
    </a>
  )
}

const Actions = ({retakeAction, confirmAction, error}) =>
  <div>
    <div className={classNames(
        theme.actions,
        style.actions,
        {[style.error]: error}
      )}>
      <RetakeAction retakeAction={retakeAction} />
      <ConfirmAction confirmAction={confirmAction} error={error}/>
    </div>
  </div>

const Previews = ({capture, retakeAction, confirmAction, error} ) =>
  <div className={`${theme.previews} ${theme.step}`}>
    {error ? <Error error={error} /> : <PreviewHeader /> }
    <CaptureViewer capture={capture} />
    <Actions retakeAction={retakeAction} confirmAction={confirmAction} error={error} />
  </div>

const Confirm = ({method, side, validCaptures:[capture], onConfirm, error, onRetake, actions: {deleteCaptures}}) =>
  <Previews
    capture={capture}
    retakeAction={() => {
      deleteCaptures({method, side})
      onRetake()
    }}
    confirmAction={onConfirm}
    error={error}
  />

export default trackComponent(Confirm, 'confirmation')
