import { CAPTURE_CREATE, CAPTURE_DELETE } from '../../constants'
import { cleanFalsy } from '../../../components/utils/array'
import { omit } from '../../../components/utils/object'

const initialState = {}

const stateKey = arr => cleanFalsy(arr).join('_')

export function captures (state = initialState, action = {}) {
  const { payload = {}, type } = action
  const key = stateKey([payload.method, payload.side])

  switch (type) {
    case CAPTURE_CREATE:
      return {
        ...state,
        [key]: payload,
      }

    case CAPTURE_DELETE:
      return omit(state, [key])

    default:
      return state
  }
}
