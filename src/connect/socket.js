import queryString from 'query-string';
import * as constants from '../constants';
import { actions } from '../store/actions';

export default class Socket {

  connect (jwt) {
    const query = queryString.stringify({jwt: jwt});
    const url = `${constants.SOCKET_URL}?${query}`;
    const socket = new WebSocket(url);
    this.socket = socket;
    this.onMessage();
  }

  handleData (data) {
    if (data.has_passport) {
      actions.setDocumentCaptured(true);
    }
  }

  onMessage () {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      this.handleData(data);
    }
  }

  sendMessage (message) {
    this.socket.send(message);
    actions.documentCapture({
      image: message
    })
    // console.log(message);
  }

}
