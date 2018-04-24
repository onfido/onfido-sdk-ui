import { h } from 'preact'
import style from './style.css'
import footerImg from './assets/powered-by-onfido.svg'

const Footer = () =>
  <div className={style.footer}>
    <img src={footerImg} />
 </div>

export default Footer
