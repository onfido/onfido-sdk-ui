// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'

type Props = {
  children: ?React.Node,
  className: ?string,
}

type State = {
  clientX: number,
  clientY: number,
}

export default class Pannable extends Component<Props, State> {
  container: ?HTMLDivElement

  state = {
    clientX: 0,
    clientY: 0,
  }

  handleTouchStart = (ev: SyntheticTouchEvent<HTMLDivElement>) => {
    if (ev.touches.length === 1) {
      const { clientX, clientY } = ev.touches[0]
      this.setState({ clientX, clientY })
    }
  }

  handleTouchMove = (ev: SyntheticTouchEvent<HTMLDivElement>) => {
    ev.preventDefault()
    if (ev.touches.length === 1) {
      const { clientX, clientY } = ev.touches[0]
      this.handlePan(this.state.clientX - clientX, this.state.clientY - clientY)
      this.setState({ clientX, clientY })
    }
  }

  handlePan = (deltaX: number, deltaY: number) => {
    if (this.container) {
      this.container.scrollLeft += deltaX
      this.container.scrollTop += deltaY
    }
  }

  center() {
    if (this.container) {
      const { clientWidth, scrollWidth, clientHeight, scrollHeight } = this.container
      this.container.scrollLeft = (scrollWidth - clientWidth) / 2
      this.container.scrollTop = (scrollHeight - clientHeight) / 2
    }
  }

  render() {
    const { children, className } = this.props;

    return (
      <div
        ref={ node => this.container = node }
        className={ classNames(style.container, className) }
        onTouchStart={ this.handleTouchStart }
        onTouchMove={ this.handleTouchMove }
      >
        { children }
      </div>
    );
  }
}

