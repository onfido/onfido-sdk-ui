import { CAPTURE_SET, CAPTURE_DELETE } as constants from '../../constants'
import { identity } from '../../components/utils/func'

export const setCapture = payload => ({ type: CAPTURE_SET, payload })
export const deleteCapture = payload => ({ type: CAPTURE_DELETE, payload })
