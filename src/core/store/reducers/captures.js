import { CAPTURE_CREATE, CAPTURE_DELETE, SET_CAPTURE_METADATA } from '../../constants'
import { cleanFalsy } from '~utils/array'
import { omit } from '~utils/object'

const initialState = {}

const stateKey = arr => cleanFalsy(arr).join('_')
const getKeyByCaptureId = (captures = {}, captureId) =>
  Object.keys(captures).find(key => captures[key].id === captureId)

export function captures (state = initialState, action = {}) {
  const { payload = {}, type } = action
  const key = payload.captureId
    ? getKeyByCaptureId(state, payload.captureId)
    : stateKey([payload.method, payload.side])

  switch (type) {
    case CAPTURE_CREATE:
      return {
        ...state,
        [key]: payload,
      }

    case CAPTURE_DELETE:
      return omit(state, [key])

    case SET_CAPTURE_METADATA:
      return {
        ...state,
        [key]: {
          ...state[key],
          metadata: payload.metadata,
        }
      }

    default:
      return state
  }
}
