import { h } from 'preact'
import style from './style.css'

const Title = ({title, subTitle}) =>
  <div className={style.titleWrapper}>
    <div className={style.title}>{title}</div>
    { subTitle && <div>{subTitle}</div> }
  </div>

export default Title
