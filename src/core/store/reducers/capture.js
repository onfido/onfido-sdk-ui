import { CAPTURE_SET, CAPTURE_DELETE } from '../../constants'

const initialState = {}

export function (state = initialState, action) {
  const { capture } = action.payload || {}
 
  switch (action.type) {
    case constants.CAPTURE_SET:
      return capture

    case constants.CAPTURE_DELETE:
      return initialState

    default:
      return state
  }
}
