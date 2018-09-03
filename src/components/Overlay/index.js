import { h } from 'preact'
import classNames from 'classnames'
import { functionalSwitch } from '../utils'
import style from './style.css'

export default function ({method, isFullScreen, isWithoutHole }) {
  return functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div className={classNames({
        [style.fullScreenOverlay]: isFullScreen,
        [style.isWithoutHole]: isWithoutHole,
      })}>
        <FaceOverlay />
      </div>
    )
  })
}

const FaceOverlay = () =>
  <span className={style.face} />

const DocumentOverlay = () =>
  <span className={style.rectangle} />
