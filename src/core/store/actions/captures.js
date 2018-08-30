import { CAPTURE_CREATE, CAPTURE_DELETE } as constants from '../../constants'
import { identity } from '../../components/utils/func'

export const createCapture = payload => ({ type: CAPTURE_CREATE, payload })
export const deleteCaptures = payload => ({ type: CAPTURE_DELETE, payload })
