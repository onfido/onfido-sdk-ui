import * as constants from '../../constants'

const identity = (a)=>a

//follows https://github.com/acdlite/redux-actions design
const createAction = (type, payloadCreator) => (payload) =>
  ({
    type,
    payload:(payloadCreator || identity)(payload)
  })

export const createCapture = createAction(constants.CAPTURE_CREATE, (payload) => ({ maxCaptures: 3, ...payload }))
export const validateCapture = createAction(constants.CAPTURE_VALIDATE, (payload) => ({ valid: true, ...payload }))
export const confirmCapture = createAction(constants.CAPTURE_CONFIRM)
export const deleteCaptures = createAction(constants.CAPTURE_DELETE)
