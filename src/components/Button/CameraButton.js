import { h } from 'preact'

const CameraButton = ({disabled, onClick, ariaLabel, className}) =>
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onClick}
    className={className}
  />

export default CameraButton
