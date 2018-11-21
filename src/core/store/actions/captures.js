import { CAPTURE_CREATE, CAPTURE_DELETE, SET_CAPTURE_REMOTE_ID } from '../../constants'

export const createCapture = payload => ({ type: CAPTURE_CREATE, payload })
export const setCaptureRemoteId = payload => ({ type: SET_CAPTURE_REMOTE_ID, payload })
export const deleteCapture = () => ({ type: CAPTURE_DELETE })
