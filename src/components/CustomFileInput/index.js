// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
type Props = {
  children: ?React.Node,
  className: ?string,
  onClick: ?void => void,
  onFileSelected: File => void,
}

const noop = () => {}

export default class CustomFileInput extends React.Component<Props> {
  static defaultProps: Props = {
    children: null,
    className: '',
    onClick: noop,
    onFileSelected: noop,
  }

  input: ?HTMLInputElement

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.input) {
      this.props.onChange(this.input.files[0])
    }
    event.currentTarget.value = '' // Allow re-uplading the same file
  }

  render = () => {
    const { children, className, onClick, onChange, ...other } = this.props // eslint-disable-line no-unused-vars
    return (
      <div className={classNames(style.container, className)}>
        { children }
        <input
          type="file"
          className={style.input}
          ref={ ref => this.input = ref }
          onChange={this.handleChange}
          onClick={onClick}
          {...other}
        />
      </div>
    )
  }
}
