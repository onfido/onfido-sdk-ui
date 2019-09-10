import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

const FallbackButton = ({text, onClick}) => (
    <button type="button" className={`${style.fallbackButton} ${theme.warning}`} onClick={onClick}>
      {text}
    </button>
)

export default FallbackButton
