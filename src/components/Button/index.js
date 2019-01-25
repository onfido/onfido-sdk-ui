import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'

const Button = ({ className, textClassName, variants = [], children, ...props }) => (
  <button
    className={classNames(className, style.button, ...variants.map(v => style['button-' + v]))}
    {...props}
  >
    <span className={classNames(textClassName, style['button-text'])}>
      {children}
    </span>
  </button>
)

export default Button
