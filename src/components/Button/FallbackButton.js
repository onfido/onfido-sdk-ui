import { h } from 'preact'
import theme from '../Theme/style.scss'
import style from './style.scss'

const FallbackButton = ({ text, onClick }) => (
  <button
    type="button"
    className={`${style.fallbackButton} ${theme.warning}`}
    onClick={onClick}
  >
    {text}
  </button>
)

export default FallbackButton
