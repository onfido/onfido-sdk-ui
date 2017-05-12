import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import theme from '../Theme/style.css'
import style from './style.css'
import {functionalSwitch, impurify} from '../utils'
import { isOfFileType } from '../utils/file'
import {preventDefaultOnClick} from '../utils'

/*
iframe was abandoned since it was harder to control in mobile devices

ref: object  and google drive approach - http://stackoverflow.com/a/25766870/689223
ref: general approach http://stackoverflow.com/a/23681394/689223
 */
const FileViewer = ({file:{preview, type}}) =>
  <object data={preview} type={type} className={style.fileViewer}>
    <embed src={preview}>
        This browser does not support PDFs.
        Please download the PDF to view it:
        <a href={preview}>Download PDF</a>
    </embed>
  </object>


const CaptureViewerPure = ({capture:{blob}}) =>
  <div className={style.captures}>
    {isOfFileType(['pdf'], blob) ?
      <FileViewer file={blob}/> :
      <img src={blob.preview} className={style.image} />
    }
  </div>

class CaptureViewer extends Component {
  constructor (props) {
    super(props)
    const {capture:{blob}}  = props
    if (blob){
      this.state = { previewUrl: URL.createObjectURL(blob) }
    }
  }

  updateBlobPreview(blob) {
    this.revokePreviewURL()
    if (blob){
      this.setState({ previewUrl: URL.createObjectURL(blob) })
    }
  }

  revokePreviewURL(){
    URL.revokeObjectURL(this.state.previewUrl)
  }

  componentWillReceiveProps({capture:{blob}}) {
    this.updateBlobPreview(blob)
  }

  componentWillUnmount() {
    this.revokePreviewURL()
  }

  render () {
    const {capture:{blob}} = this.props
    return <CaptureViewerPure
      capture={{
        blob:{
          type: blob.type, preview: this.state.previewUrl
        }
      }}/>
  }
}

const Previews = ({capture, retakeAction, confirmAction} ) =>
  <div className={`${theme.previews} ${theme.step}`}>
    <h1 className={theme.title}>Confirm capture</h1>
    <p>Please confirm that you are happy with this photo.</p>
    <CaptureViewer capture={capture} />
    <div className={`${theme.actions} ${style.actions}`}>
      <button
        onClick={retakeAction}
        className={`${theme.btn} ${style["btn-outline"]}`}
      >
        Take again
      </button>
      <a
        href=''
        className={`${theme.btn} ${theme["btn-primary"]}`}
        onClick={preventDefaultOnClick(confirmAction)}
      >
        Confirm
      </a>
    </div>
  </div>

const Confirm = ({nextStep, method, side, validCaptures,
                  actions: {deleteCaptures, confirmCapture}}) => {

  const capture = validCaptures[0]

  return <Previews
    capture={capture}
    retakeAction={() => deleteCaptures({method, side})}
    confirmAction={() => {
      confirmCapture({method, id: capture.id})
      confirmEvent(method, side)
      nextStep()
    }}
  />
}

const confirmEvent = (method, side) => {
  if (method === 'document') {
    if (side === 'front') events.emit('documentCapture')
    else if (side === 'back') events.emit('documentBackCapture')
  }
  else if (method === 'face') events.emit('faceCapture')
}

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Camera will not have componentWillUnmount called
export default impurify(Confirm)
