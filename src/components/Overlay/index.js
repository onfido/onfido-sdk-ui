import { h } from 'preact'
import Countdown from '../Countdown'
import { functionalSwitch } from '../utils'
import style from './style.css'

export const Overlay = ({method, countDownRef}) => (
  functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div>
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

