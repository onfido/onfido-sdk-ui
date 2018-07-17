import { h } from 'preact'
import classNames from 'classnames'
import { functionalSwitch } from '../utils'
import style from './style.css'

export const Overlay = ({method, isFullScreen, isFullScreenDesktop}) => (
  functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div className={classNames({
        [style.fullScreenOverlay]: isFullScreen,
        [style.fullScreenDesktopOverlay]: isFullScreenDesktop,
      })}>
        <FaceOverlay />
      </div>
    )
  })
)

const FaceOverlay = () =>
  <span className={style.face} />

const DocumentOverlay = () =>
  <span className={style.rectangle}/>
