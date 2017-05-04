import { h, Component } from 'preact'
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


const Capture = ({capture:{image}}) =>
  <div className={style.captures}>
    {isOfFileType(['pdf'], image) ?
      <FileViewer file={image}/> :
      <img src={image.preview} className={style.image} />
    }
  </div>


const Previews = ({capture, retakeAction, confirmAction} ) =>
  <div className={`${theme.previews} ${theme.step}`}>
    <h1 className={theme.title}>Confirm capture</h1>
    <p>Please confirm that you are happy with this photo.</p>
    <Capture capture={capture} />
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

const Confirm = ({
      nextStep,
      method,
      validCaptures,
      actions: {
        deleteCaptures,
        confirmCapture
      }
    }) => {

  const capture = validCaptures[method][0]

  return <Previews
    capture={capture}
    retakeAction={() => deleteCaptures({method})}
    confirmAction={() => {
      confirmCapture({method, id: capture.id})
      nextStep()
    }}
  />
}

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Camera will not have componentWillUnmount called
export default impurify(Confirm)
