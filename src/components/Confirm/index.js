import { h, Component } from 'preact'
import { Link } from 'preact-router'

const Capture = ({ captures }) => {
  const [ capture ] = captures
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
      <Capture {...props} captures={props.captures} />
      <div className='onfido-actions'>
        <button
          onClick={() => {props.action(props.method);}}
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

class Confirm extends Component {
  render () {
    const {
      method,
      documentCaptures,
      faceCaptures,
      actions: {
        deleteCaptures
      }
    } = this.props
    const methods = {
      'document': () => (
        <Previews
          captures={documentCaptures}
          action={deleteCaptures}
          {...this.props}
        />
      ),
      'face': () => (
        <Previews
          captures={faceCaptures}
          action={deleteCaptures}
          {...this.props}
        />
      ),
      'other': () => null
    }
    return (methods[method] || methods['other'])()
  }
}

export default Confirm
