import queryString from 'query-string';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import * as constants from '../constants';
import { actions } from '../store/actions';

const { setDocumentCaptured } = actions;

export default class Socket {

  connect (jwt) {
    const query = queryString.stringify({ jwt: jwt });
    const url = `${constants.DEV_SOCKET_URL}?${query}`;
    const socket = new ReconnectingWebSocket(url);
    this.socket = socket;
    this.onMessage();
  }

  handleData (data) {
    if (data.is_document || data.has_passport) {
      setDocumentCaptured(true);
    }
  }

  onError (error) {

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
    // actions.documentCapture(message);
    // console.log(message);
  }

}
