import { h } from 'preact'

const CameraButton = ({disableInteraction, onClick, ariaLabel, className}) =>
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disableInteraction}
    onClick={onClick}
    className={className}
  />

export default CameraButton
