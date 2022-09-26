import { h, Component, createRef } from 'preact'
import classNames from 'classnames'
import style from './style.scss'
import { JSXInternal } from 'preact/src/jsx'

type Props = {
  children?: React.ReactNode
  className?: string
}

type State = {
  clientX: number
  clientY: number
}

export default class Pannable extends Component<Props, State> {
  container = createRef<HTMLDivElement>()

  state = {
    clientX: 0,
    clientY: 0,
  }

  handleTouchStart = (
    event: JSXInternal.TargetedTouchEvent<HTMLDivElement>
  ) => {
    if (event.touches.length === 1) {
      const { clientX, clientY } = event.touches[0]
      this.setState({ clientX, clientY })
    }
  }

  handleTouchMove = (event: JSXInternal.TargetedTouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.touches.length === 1) {
      const { clientX, clientY } = event.touches[0]
      this.handlePan(this.state.clientX - clientX, this.state.clientY - clientY)
      this.setState({ clientX, clientY })
    }
  }

  handlePan = (deltaX: number, deltaY: number) => {
    if (this.container.current) {
      this.container.current.scrollLeft += deltaX
      this.container.current.scrollTop += deltaY
    }
  }

  center() {
    if (this.container.current) {
      const {
        clientWidth,
        scrollWidth,
        clientHeight,
        scrollHeight,
      } = this.container.current
      this.container.current.scrollLeft = (scrollWidth - clientWidth) / 2
      this.container.current.scrollTop = (scrollHeight - clientHeight) / 2
    }
  }

  render() {
    const { children, className } = this.props

    return (
      <div
        ref={this.container}
        className={classNames(style.container, className)}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {children}
      </div>
    )
  }
}
