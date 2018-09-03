import { CAPTURE_CREATE, CAPTURE_DELETE } from '../../constants'

export const createCapture = payload => ({ type: CAPTURE_CREATE, payload })
export const deleteCapture = () => ({ type: CAPTURE_DELETE })
