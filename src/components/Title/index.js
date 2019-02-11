import { h } from 'preact'
import { withFullScreenState } from '../FullScreen'
import style from './style.css'
import classNames from 'classnames'

const Title = ({title, subTitle, smaller, isFullScreen, className}) =>
  <div className={classNames(
      style.titleWrapper,
      {
        [style.smaller]: smaller && !isFullScreen,
        [style.fullScreen]: isFullScreen
      },
      className
    )}>
    <div className={style.title}>
      <span className={style.titleSpan}>{title}</span>
    </div>
    { subTitle && <div>{subTitle}</div> }
  </div>

export default withFullScreenState(Title)
