import { h } from 'preact'
import withOnSubmitDisabling from './withOnSubmitDisabling'

const CameraButton = ({disabled, onBtnClick, ariaLabel, className}) =>
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onBtnClick}
    className={className}
  />

export default withOnSubmitDisabling(CameraButton)
