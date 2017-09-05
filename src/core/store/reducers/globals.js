import * as constants from '../../constants'

const initialState = {
  documentType: null
}

export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_DOCUMENT_TYPE:
      return {...state, documentType: action.payload }
    default:
      return state
  }
}
