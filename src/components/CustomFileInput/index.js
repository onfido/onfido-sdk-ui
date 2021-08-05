// import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.scss'

/* type Props = {
  children: ?React.Node,
  className: ?string,
  onClick: (?void) => void,
  onChange: (File) => void,
} */

const noop = () => {}

export default class CustomFileInput extends Component {
  static defaultProps = {
    children: null,
    className: '',
    onClick: noop,
    onChange: noop,
  }

  input

  handleClick = () => {
    if (this.input) {
      this.input.click()
    }
    this.props.onClick()
  }

  handleChange = (event) => {
    if (this.input) {
      this.props.onChange(this.input.files[0])
    }
    event.currentTarget.value = '' // Allow re-uplading the same file
  }

  render = () => {
    const { children, className, onClick, onChange, ...other } = this.props // eslint-disable-line no-unused-vars
    return (
      <span
        onClick={this.handleClick}
        className={classNames(style.container, className)}
      >
        {children}
        <input
          type="file"
          className={style.input}
          ref={(ref) => (this.input = ref)}
          onChange={this.handleChange}
          {...other}
        />
      </span>
    )
  }
}
