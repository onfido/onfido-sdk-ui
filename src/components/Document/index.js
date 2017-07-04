import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

export const DocumentTitle = ({ useCapture, side, title }) => {
  const titleType = useCapture ? 'captureTitle' : 'uploadTitle'
  return <div className={theme.title}>{title[side][titleType]}</div>
}

DocumentTitle.defaultProps = {
  title: {
    front: {
      captureTitle: `Place the front of your document in the rectangle`,
      uploadTitle: `Upload the front of your document`
    },
    back: {
      captureTitle: `Place the back of your document in the rectangle`,
      uploadTitle: `Upload the back of your document`
    }
  }
}

export const DocumentOverlay = () =>
  <div className={theme.overlay}>
    <span className={`${theme["overlay-shape"]} ${style.rectangle}`}/>
  </div>

export const DocumentInstructions = () =>
  <div className={style.capture}>
    <p className={theme.center}>Once it is detected you will be automatically directed to the next step.</p>
  </div>
