import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'

export const FaceOverlay = ({ isFullScreen, isWithoutHole }) =>
  <div className={classNames({
    [style.fullScreenOverlay]: isFullScreen,
    [style.isWithoutHole]: isWithoutHole,
  })}>
    <span className={style.face} />
  </div>

export  const DocumentOverlay = () =>
  <span className={style.rectangle} />
