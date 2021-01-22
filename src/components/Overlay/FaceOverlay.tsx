import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import style from './style.scss'

type FaceOverlayProps = {
  isWithoutHole?: boolean
}

const FaceOverlay: FunctionComponent<FaceOverlayProps> = ({
  isWithoutHole,
}) => (
  <div
    data-onfido-qa="faceOverlay"
    className={classNames(style.faceOverlay, {
      [style.isWithoutHole]: isWithoutHole,
    })}
  >
    <span className={style.face} />
  </div>
)

export default withFullScreenState(FaceOverlay)
