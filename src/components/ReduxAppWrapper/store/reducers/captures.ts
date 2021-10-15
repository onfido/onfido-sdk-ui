import * as constants from '~types/redux/constants'
import { buildCaptureStateKey } from '~utils/redux'

import type { CaptureActions, CaptureState, CaptureKeys } from '~types/redux'

export const initialState: CaptureState = {
  takesHistory: {
    document_front: [],
    document_back: [],
    document_video: [],
    face: [],
  },
}

const getKeyByCaptureId = (
  captures: CaptureState = initialState,
  captureId: string
) => {
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
    // If user transitions to Cross Device after Document capture step, a CAPTURE_CREATE action with {} as the payload is fired
    // This causes the current state's document_front to be updated with the {} payload and misreporting a 2nd document_front retake
    // during Face capture on Cross Device flow.
    // We want to return current state instead of proceeding with creating the capture if a CAPTURE_CREATE action's payload does not have a method
    // as buildCaptureStateKey must return a key which by default is document_front
    if (!action.payload.method) {
      return state
    }
    const key = buildCaptureStateKey(action.payload)

    // Record a new capture created
    const { [key]: currentTakesHistory } = state.takesHistory
    const newTakesHistory = [...currentTakesHistory, new Date().toISOString()]

    const newPayload = {
      ...action.payload,
      sdkMetadata: {
        ...action.payload.sdkMetadata,
        // Write latest `take_number` to `sdkMetadata`
        take_number: newTakesHistory.length,
      },
    }

    return {
      ...state,
      [key]: newPayload,

      // Update `takesHistory` with latest data
      takesHistory: { ...state.takesHistory, [key]: newTakesHistory },
    }
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
