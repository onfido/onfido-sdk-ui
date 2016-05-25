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
  const filterValid = (capture) => capture.isValid
  const [ capture ] = captures.filter(filterValid)
  return (
    <div class='onfido-captures'>
      <img src={capture.image} className='onfido-image' />
    </div>
  )
}

const Previews = ({ captures, method, action }) =>  {
  const methods = {
    'document': () => (
      <div className='onfido-previews'>
        <Captures captures={captures} />
        <Retake action={action} />
      </div>
    ),
    'face': () => (
      <div className='onfido-previews'>
        <Captures captures={captures} />
        <Retake action={action} />
      </div>
    ),
    'home': () => null
  }
  return (methods[method] || methods['home'])()
}

export default Previews
