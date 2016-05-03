import queryString from 'query-string';
import { XHR_URL } from '../utils/constants';

export const xhr = {

  connect (key) {
    const query = queryString.stringify({key: key})
    const url = `${XHR_URL}?${query}`
    console.log(`connecting to ${url}`)
  },

  auth (params) {
    setTimeout(() => {
      console.log('authorised')
      params.resolve()
    }, 1000)
  },

  send (message) {
    console.log(message)
  }

}
