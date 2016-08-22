import { h, Component } from 'preact'
import theme from '../../style/refactor.css'
import style from './style.css'

export const DocumentNotFound = () => {
  return (
    <div className='onfido-upload-text onfido-upload-error'>We couldn’t detect a passport or identity card in this image. Please upload another one.</div>
  )
}

export const DocumentTitle = ({ useCapture }) => {
  const titleString = useCapture ?
    'Place your document in the rectangle' :
    'Upload a picture of your document'

  return <div className={theme.title}>{titleString}</div>
}

export const DocumentOverlay = () => {
  return (
    <div className={theme.overlay}>
      <span className={`${theme["overlay-shape"]} ${style.rectangle}`}/>
    </div>
  )
}

export const DocumentInstructions = () => {
  return (
    <div className={style.capture}>
      <p className={theme.center}>Once it is detected you will be automatically directed to the next step.</p>
    </div>
  )
}
