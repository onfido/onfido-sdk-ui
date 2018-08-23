// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { preventDefault } from '../utils'
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

  handleUpload = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.input) {
      this.props.onFileSelected(this.input.files[0])
    }
    event.currentTarget.value = '' // Allow re-uplading the same file
  }

  handleClick = () => {
    if (this.input) {
      this.input.click()
    }
  } 

  render = () => {
    const { children, className, onClick, onFileSelected, ...other } = this.props
    return (
      <span onClick={this.handleClick} className={classNames(style.container, className)}>
        { children }
        <input
          type="file"
          className={style.input}
          ref={ ref => this.input = ref }
          onChange={this.handleUpload}
          {...other}
        />
      </span>
    )
  }
}
