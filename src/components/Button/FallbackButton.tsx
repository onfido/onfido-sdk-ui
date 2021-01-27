import { h, FunctionComponent } from 'preact'
import theme from '../Theme/style.scss'
import style from './style.scss'

export type Props = {
  text: string
  onClick?: () => void
}

const FallbackButton: FunctionComponent<Props> = ({ text, onClick }) => (
  <button
    type="button"
    className={`${style.fallbackButton} ${theme.warning}`}
    onClick={onClick}
  >
    {text}
  </button>
)

export default FallbackButton
