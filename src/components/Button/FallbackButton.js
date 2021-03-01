import { h } from 'preact'
import classNames from 'classnames'
import theme from '../Theme/style.scss'
import style from './style.scss'

const FallbackButton = ({ text, onClick }) => (
  <button
    type="button"
    className={classNames(style.fallbackButton, theme.warningFallbackButton)}
    onClick={onClick}
  >
    {text}
  </button>
)

export default FallbackButton
