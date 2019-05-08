import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'

const Button = ({ className, textClassName, variants = [], disabled, children, onClick }) => (
  <button
    className={classNames(className, style.button, ...variants.map(v => style['button-' + v]))}
    onClick={onClick}
    disabled={disabled}
  >
    <span className={classNames(textClassName, style['button-text'])}>
      {children}
    </span>
  </button>
)

export default Button
