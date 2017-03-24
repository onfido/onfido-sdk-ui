import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'
import { impurify } from '../utils'

const Complete = ({message, submessage}) => (
  <div>
    <div className={theme.step}>
      <span className={`${theme.icon}  ${style.icon}`}></span>
      <h1 className={`${theme.title} ${theme.center}`}>{message}</h1>
      <p className={`${theme["mbottom-large"]} ${theme.center}`}>{submessage}</p>
    </div>
  </div>
)

Complete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default impurify(Complete)
