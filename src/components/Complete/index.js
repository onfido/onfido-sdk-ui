import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../../style/refactor.css'
import style from './style.css'

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

export default Complete
