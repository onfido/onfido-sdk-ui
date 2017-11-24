import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

export const DocumentOverlay = () =>
  <div className={theme.overlay}>
    <span className={`${theme["overlay-shape"]} ${style.rectangle}`}/>
  </div>
