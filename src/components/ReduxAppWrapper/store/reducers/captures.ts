import * as constants from '../../constants'
import { cleanFalsy } from '~utils/array'
import { omit } from '~utils/object'
import type { DocumentCapture, FaceCapture, CaptureActions } from '../../types'

type CaptureKeys = 'document_front' | 'document_back' | 'face'

export type CaptureState = Partial<
  Record<CaptureKeys, DocumentCapture | FaceCapture>
>

const initialState: CaptureState = {}

const stateKey = (arr: string[]) => cleanFalsy(arr).join('_')
const getKeyByCaptureId = (captures: CaptureState = {}, captureId: string) =>
  (Object.keys(captures) as CaptureKeys[]).find(
    (key: CaptureKeys) => captures[key].id === captureId
  )

export function captures(
  state = initialState,
  action: CaptureActions
): CaptureState {
  if (action.type === constants.CAPTURE_DELETE) {
    const key = stateKey([action.payload.method, action.payload.side])
    return omit(state, [key])
  }

  if (action.type === constants.CAPTURE_CREATE) {
    const key = stateKey([action.payload.method, action.payload.side])
    return {
      ...state,
      [key]: action.payload,
    }
  }

  if (action.type === constants.SET_CAPTURE_METADATA) {
    const key = getKeyByCaptureId(state, action.payload.captureId)

    return {
      ...state,
      [key]: {
        ...state[key],
        metadata: action.payload.metadata,
      },
    }
  }

  return state
}
