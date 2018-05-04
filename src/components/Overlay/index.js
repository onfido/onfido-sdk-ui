import { h } from 'preact'
import Countdown from '../Countdown'
import classNames from 'classnames'
import { functionalSwitch } from '../utils'
import style from './style.css'

export const Overlay = ({method, countDownRef, isFullScreen}) => (
  functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div className={classNames({[style.fullScreenOverlay]: isFullScreen})}>
        <Countdown ref={countDownRef} />
        <FaceOverlay />
      </div>
    )
  })
)

const FaceOverlay = () =>
  <span className={style.circle} />

const DocumentOverlay = () =>
  <span className={style.rectangle}/>
