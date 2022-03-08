import { FunctionComponent, h } from 'preact'

type Props = {
  ariaLabel: string
  disableInteraction: boolean | undefined
  onClick?: () => void
  className?: string | undefined
}

const CameraButton: FunctionComponent<Props> = ({
  disableInteraction,
  onClick,
  ariaLabel,
  className,
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disableInteraction}
    onClick={onClick}
    className={className}
  />
)

export default CameraButton
