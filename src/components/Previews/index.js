import { h, Component } from 'preact'

const Retake = ({ action }) => {
  return (
    <p className='onfido-retake'>
      <button
        onClick={() => action(false)}
        className='onfido-btn onfido-btn-outline'
      >
        Retake?
      </button>
    </p>
  )
}

const Captures = ({ captures }) => {
  const [ capture ] = captures
  return (
    <div class='onfido-captures'>
      <img src={capture.image} className='onfido-image' />
    </div>
  )
}

const Previews = (props) =>  {
  const { documentCaptures, faceCaptures, method, actions } = props
  const methods = {
    'document': () => {
      return (
        <div className='onfido-previews'>
          <Captures captures={documentCaptures} />
          <Retake action={actions.setDocumentCaptured} />
        </div>
      )
    },
    'face': () => {
      return (
        <div className='onfido-previews'>
          <Captures captures={faceCaptures} />
          <Retake action={actions.setFaceCaptured} />
        </div>
      )
    },
    'home': () => null
  }
  return (methods[method] || methods['home'])()
}

export default Previews
