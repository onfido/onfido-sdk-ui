import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { withFullScreenState } from '../FullScreen'

export const FaceOverlay = withFullScreenState(({ isFullScreen, isWithoutHole }) =>
  <div className={classNames({
    [style.fullScreenOverlay]: isFullScreen,
    [style.isWithoutHole]: isWithoutHole,
  })}>
    <span className={style.face} />
  </div>
)

export  const DocumentOverlay = () =>
  <span className={style.rectangle} />
