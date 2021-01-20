import { h, ComponentType } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import style from './style.scss'

type Props = {
  isWithoutHole?: boolean
}

const FaceOverlay = withFullScreenState<ComponentType<Props>>(
  ({ isWithoutHole }) => (
    <div
      data-onfido-qa="faceOverlay"
      className={classNames(style.faceOverlay, {
        [style.isWithoutHole]: isWithoutHole,
      })}
    >
      <span className={style.face} />
    </div>
  )
)

export default FaceOverlay
