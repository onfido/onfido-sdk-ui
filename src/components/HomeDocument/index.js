import { h, Component } from 'preact'

const documents = [{
  method: 'passport',
  name: 'Passport'
}, {
  method: 'identity',
  name: 'Identity Card'
}, {
  method: 'license',
  name: 'Drivers License'
}]

const renderDocument = (method) => {
  return (
    <h1>{method.name}</h1>
  )
}

const HomeDocument = () => {
  return (
    <div className='onfido-wrapper'>
      {documents.map(renderDocument)}
    </div>
  )
}

export default HomeDocument
