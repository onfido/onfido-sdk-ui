import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

export const FaceTitle = ({ useCapture }) => {
  const titleString = useCapture ?
    'Place your face in the circle' :
    'Upload a picture of your face'

  return <div className={`${theme.title} ${style.title}`}>{titleString}</div>
}

export const FaceOverlay = () => {
  return (
    <div className={theme.overlay}>
      <span className={`${theme["overlay-shape"]} ${style.circle}`} />
    </div>
  )
}

export const FaceInstructions = ({ handeClick }) => {
  return (
    <div className={style.instructions}>
      <button
        className={`${theme.btn} ${theme["btn-primary"]} ${theme["btn-centered"]}`}
        onClick={handeClick}
      >
        Take photo
      </button>
    </div>
  )
}
