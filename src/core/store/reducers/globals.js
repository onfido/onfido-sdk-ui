import * as constants from '../../constants'

const initialState = {
  documentType: null,
  roomId: null,
  socket: null,
  mobileNumber: null,
  clientSuccess: false,
}


export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_DOCUMENT_TYPE:
      return {...state, documentType: action.payload }
    case constants.SET_ROOM_ID:
      return {...state, roomId: action.payload}
    case constants.SET_SOCKET:
      return {...state, socket: action.payload}
    case constants.SET_MOBILE_NUMBER:
      return {...state, mobileNumber: action.payload}
    case constants.SET_CLIENT_SUCCESS:
      return {...state, clientSuccess: action.payload}
    case constants.DELETE_MOBILE_NUMBER:
      return {...state, mobileNumber: null}
    default:
      return state
  }
}
