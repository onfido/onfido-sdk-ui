import { CAPTURE_CREATE, CAPTURE_DELETE, SET_CAPTURE_REMOTE_ID } from '../../constants'
import { cleanFalsy } from '../../../components/utils/array'
import { omit } from '../../../components/utils/object'

const initialState = {}

const stateKey = arr => cleanFalsy(arr).join('_')
const getCaptureById =
    // eslint-disable-next-line no-unused-vars
    (captures = {}, requestedId) => Object.entries(captures).find(([ _, capture ]) => capture.id === requestedId)

export function captures (state = initialState, action = {}) {
  const { payload = {}, type } = action
  const key = payload.captureId ? getCaptureById(state, payload.captureId)[0] : stateKey([payload.method, payload.side])

  switch (type) {
    case CAPTURE_CREATE:
      return {
        ...state,
        [key]: payload,
      }

    case SET_CAPTURE_REMOTE_ID:
      return {
        ...state,
        [key]: {
          ...state[key],
          remoteId: payload.remoteId
        },
      }

    case CAPTURE_DELETE:
      return omit(state, [key])

    default:
      return state
  }
}
