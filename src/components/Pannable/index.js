import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.scss'

/* type Props = {
  children: ?React.Node,
  className: ?string,
}

type State = {
  clientX: number,
  clientY: number,
} */

export default class Pannable extends Component {
  container = null

  state = {
    clientX: 0,
    clientY: 0,
  }

  handleTouchStart = (ev) => {
    if (ev.touches.length === 1) {
      const { clientX, clientY } = ev.touches[0]
      this.setState({ clientX, clientY })
    }
  }

  handleTouchMove = (ev) => {
    ev.preventDefault()
    if (ev.touches.length === 1) {
      const { clientX, clientY } = ev.touches[0]
      this.handlePan(this.state.clientX - clientX, this.state.clientY - clientY)
      this.setState({ clientX, clientY })
    }
  }

  handlePan = (deltaX, deltaY) => {
    if (this.container) {
      this.container.scrollLeft += deltaX
      this.container.scrollTop += deltaY
    }
  }

  center() {
    if (this.container) {
      const {
        clientWidth,
        scrollWidth,
        clientHeight,
        scrollHeight,
      } = this.container
      this.container.scrollLeft = (scrollWidth - clientWidth) / 2
      this.container.scrollTop = (scrollHeight - clientHeight) / 2
    }
  }

  render() {
    const { children, className } = this.props

    return (
      <div
        ref={(node) => (this.container = node)}
        className={classNames(style.container, className)}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {children}
      </div>
    )
  }
}
