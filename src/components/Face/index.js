import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

export const FaceTitle = ({ useCapture }) => {
  const titleString = useCapture ?
    'Place your face in the circle' :
    'Upload a selfie'

  return <div className={theme.title}>{titleString}</div>
}

export const FaceOverlay = () => {
  return (
    <div className={theme.overlay}>
      <span className={`${theme["overlay-shape"]} ${style.circle}`} />
    </div>
  )
}
