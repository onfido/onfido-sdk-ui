import { h } from 'preact'
import style from './style.css'
import classNames from 'classnames'

const Title = ({title, subTitle, smaller, className}) =>
  <div className={classNames(
      style.titleWrapper,
      {[style.smaller]: smaller},
      className
    )}>
    <div className={style.title}>{title}</div>
    { subTitle && <div>{subTitle}</div> }
  </div>

export default Title
