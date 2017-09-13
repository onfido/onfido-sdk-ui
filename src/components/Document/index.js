import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

const DocumentInstructions = ({useCapture}) => {
  if (useCapture) return <p className={theme.center}>Place it in the rectangle and it will be detected automatically.</p>
}

export const DocumentTitle = ({ useCapture, side, title }) => {
  const titleType = useCapture ? 'captureTitle' : 'uploadTitle'
  return (
    <div>
      <div className={`${theme.title} ${style.title}`}>{title[side][titleType]}</div>
      <DocumentInstructions useCapture={useCapture}/>
    </div>
  )
}

DocumentTitle.defaultProps = {
  title: {
    front: {
      captureTitle: `Front of document`,
      uploadTitle: `Upload the front of your document`
    },
    back: {
      captureTitle: `Back of document`,
      uploadTitle: `Upload the back of your document`
    }
  }
}

export const DocumentOverlay = () =>
  <div className={theme.overlay}>
    <span className={`${theme["overlay-shape"]} ${style.rectangle}`}/>
  </div>
