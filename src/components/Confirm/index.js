import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Captures = ({ captures }) => {
  const filterValid = (capture) => capture.isValid
  const [ capture ] = captures.filter(filterValid)
  return (
    <div className='onfido-captures'>
      <img src={capture.image} className='onfido-image' />
    </div>
  )
}

const Previews = (props) =>  {
  const nextLink = `/step/${(parseInt(props.step, 10) + 1 || 1)}/`
  return (
    <div className='onfido-previews onfido-step'>
      <h1 className='onfido-title'>Confirm capture</h1>
      <p>Please confirm that you are happy with this photo.</p>
      <Captures captures={props.captures} />
      <div className='onfido-actions'>
        <button
          onClick={() => props.action(false)}
          className='onfido-btn onfido-btn-outline'
        >
          Take again
        </button>
        <Link href={nextLink} className='onfido-btn onfido-btn-primary'>
          Confirm
        </Link>
      </div>
    </div>
  )
}

const Confirm = (props) => {
  const { method, actions, documentCaptures, faceCaptures } = props
  const { setDocumentCaptured, setFaceCaptured } = actions
  const methods = {
    'document': () => (
      <Previews
        captures={documentCaptures}
        action={setDocumentCaptured}
        {...props}
      />
    ),
    'face': () => (
      <Previews
        captures={faceCaptures}
        action={setFaceCaptured}
        {...props}
      />
    ),
    'other': () => null
  }
  return (methods[method] || methods['other'])()
}

export default Confirm
