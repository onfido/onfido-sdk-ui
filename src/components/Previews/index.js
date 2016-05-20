import { h, Component } from 'preact'

const Previews = ({ documentCaptures, faceCaptures, method }) =>  {
  switch (method) {
    case 'document':
      return documentCaptures.map((file) => <img src={file.image} />)
    case 'face':
      return faceCaptures.map((file) => <img src={file.image} />)
    default:
      return false
  }
}

export default Previews
