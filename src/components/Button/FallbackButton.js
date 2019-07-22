import { h } from 'preact'
import style from './style.css'

const FallbackButton = ({text, onClick}) => (
    <button type="button" className={style.fallbackButton} onClick={onClick}>
      {text}
    </button>
)

export default FallbackButton
