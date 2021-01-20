import { h, FunctionComponent, ComponentType } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import style from './style.scss'

type FaceOverlayProps = {
  isWithoutHole?: boolean
}

export const FaceOverlay = withFullScreenState<ComponentType<FaceOverlayProps>>(
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

type DocumentOverlayProps = {
  documentSize?: 'id1Card' | 'id3Card'
}

export const DocumentOverlay: FunctionComponent<DocumentOverlayProps> = ({
  documentSize,
}) => (
  <div>
    <span className={style[documentSize] || style.rectangle} />
  </div>
)
