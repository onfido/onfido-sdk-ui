import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../Theme/style.css'
import style from './style.css'

const getCapture = (captures) => {
  const [ capture ] = captures
  return capture
}

const Capture = ({ image }) => {
  return (
    <div className={style.captures}>
      <img src={image} className={style.image} />
    </div>
  )
}

const Previews = ({capture, step, retakeAction, confirmAction} ) =>  {
  const nextLink = `/step/${(parseInt(step, 10) + 1 || 1)}/`

  return (
    <div className={`${theme.previews} ${theme.step}`}>
      <h1 className={theme.title}>Confirm capture</h1>
      <p>Please confirm that you are happy with this photo.</p>
      <Capture image={capture.image} />
      <div className={`${theme.actions} ${style.actions}`}>
        <button
          onClick={retakeAction}
          className={`${theme.btn} ${style["btn-outline"]}`}
        >
          Take again
        </button>
        <a
          href={nextLink}
          className={`${theme.btn} ${theme["btn-primary"]}`}
          onClick={confirmAction}
        >
          Confirm
        </a>
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
        deleteCaptures,
        confirmCapture
      }
    } = this.props

    const captures = {
      'document': documentCaptures,
      'face': faceCaptures
    }[method]
    const capture = getCapture(captures)

    return <Previews
      capture={capture}
      retakeAction={() => deleteCaptures(method)}
      confirmAction={() => confirmCapture({method, data: capture})}
      {...this.props}
    />
  }
}

export default Confirm
