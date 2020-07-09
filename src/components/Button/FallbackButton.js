import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.scss'

const FallbackButton = ({text, onClick}) => (
    <button type="button" className={`${style['fallback-button']} ${theme.warning}`} onClick={onClick}>
      {text}
    </button>
)

export default FallbackButton
