import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import theme from '../Theme/style.scss'
import style from './style.scss'

export type Props = {
  text: string
  onClick?: () => void
}

const FallbackButton: FunctionComponent<Props> = ({ text, onClick }) => (
  <button
    type="button"
    className={classNames(style.fallbackButton, theme.warningFallbackButton)}
    onClick={onClick}
  >
    {text}
  </button>
)

export default FallbackButton
