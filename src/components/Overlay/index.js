import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { withFullScreenState } from '../FullScreen'

export const FaceOverlay = withFullScreenState(({ isWithoutHole }) =>
  <div
    data-onfido-qa="faceOverlay"
    className={classNames(style.faceOverlay, {
      [style.isWithoutHole]: isWithoutHole
    })}
  >
    <span className={style.face} />
  </div>
)

export const DocumentOverlay = ({ documentSize }) =>
  <div><span className={style[documentSize] || style.rectangle} /></div>
