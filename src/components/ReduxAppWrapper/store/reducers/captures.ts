import * as constants from '~types/redux/constants'
import { buildCaptureStateKey } from '~utils/redux'

import type { CaptureActions, CaptureState, CaptureKeys } from '~types/redux'

export const initialState: CaptureState = {}

const getKeyByCaptureId = (captures: CaptureState = {}, captureId: string) => {
  const matched = Object.entries(captures).find(
    ([, value]) => value?.id === captureId
  )

  if (!matched) {
    return undefined
  }

  return matched[0] as CaptureKeys
}

export default function captures(
  state = initialState,
  action: CaptureActions
): CaptureState {
  if (action.type === constants.RESET_STORE) {
    return initialState
  }

  if (action.type === constants.CAPTURE_DELETE) {
    const key = buildCaptureStateKey(action.payload)
    return { ...state, [key]: undefined }
  }

  if (action.type === constants.CAPTURE_CREATE) {
    const key = buildCaptureStateKey(action.payload)
    return { ...state, [key]: action.payload }
  }

  if (action.type === constants.SET_CAPTURE_METADATA) {
    const key = getKeyByCaptureId(state, action.payload.captureId)

    if (key) {
      return {
        ...state,
        [key]: {
          ...state[key],
          metadata: action.payload.metadata,
        },
      }
    }
  }

  return state
}