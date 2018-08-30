import { CAPTURE_SET, CAPTURE_DELETE } from '../../constants'

const initialState = {}

export function capture (state = initialState, action = {}) {
  const { payload, type } = action
  switch (type) {
    case CAPTURE_SET:
      return payload

    case CAPTURE_DELETE:
      return initialState

    default:
      return state
  }
}
