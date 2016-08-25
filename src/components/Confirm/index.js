import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../Theme/style.css'
import style from './style.css'

const Capture = ({ captures }) => {
  const [ capture ] = captures
  return (
    <div className={style.captures}>
      <img src={capture.image} className={style.image} />
    </div>
  )
}

const Previews = (props) =>  {
  const nextLink = `/step/${(parseInt(props.step, 10) + 1 || 1)}/`
  return (
    <div className={`${theme.previews} ${theme.step}`}>
      <h1 className={theme.title}>Confirm capture</h1>
      <p>Please confirm that you are happy with this photo.</p>
      <Capture {...props} captures={props.captures} />
      <div className={`${theme.actions} ${style.actions}`}>
        <button
          onClick={() => props.action(props.method)}
          className={`${theme.btn} ${style["btn-outline"]}`}
        >
          Take again
        </button>
        <Link href={nextLink} className={`${theme.btn} ${theme["btn-primary"]}`}>
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
