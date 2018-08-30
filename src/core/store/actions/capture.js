import { CAPTURE_SET, CAPTURE_DELETE } from '../../constants'

export const setCapture = payload => ({ type: CAPTURE_SET, payload })
export const deleteCapture = () => ({ type: CAPTURE_DELETE })
