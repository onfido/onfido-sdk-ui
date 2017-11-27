import { h } from 'preact'
import theme from '../Theme/style.css'

const Title = ({title, subTitle}) =>
  <div className={theme.titleWrapper}>
    <div className={theme.title}>{title}</div>
    { subTitle && <div>{subTitle}</div> }
  </div>

export default Title
