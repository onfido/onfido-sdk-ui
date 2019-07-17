// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
type Props = {
  children: ?React.Node,
  className: ?string,
  onClick: ?void => void,
  onChange: File => void,
}

const noop = () => {}

export default class CustomFileInput extends Component<Props> {
  static defaultProps: Props = {
    children: null,
    className: '',
    onClick: noop,
    onChange: noop,
  }

  input: ?HTMLInputElement

  handleClick = () => {
    if (this.input) {
      this.input.click()
    }
    this.props.onClick();
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.input) {
      this.props.onChange(this.input.files[0])
    }
    event.currentTarget.value = '' // Allow re-uplading the same file
  }

  handleDragOverEvent = (ev: DragEvent) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  getFileFromDragEvent = (ev: SyntheticDragEvent<HTMLSpanElement>): ?File => {
    let dataTransfer: DataTransfer = ev.dataTransfer;
    let items: DataTransferItemList = dataTransfer.items;
    let files: FileList = dataTransfer.files;

    if (items) {
      let file: ?File = items[0].getAsFile();
      return file;
    } else if (files) {
      let file: ?File = ev.dataTransfer.files[0].name;
      return file;
    }
  }

  handleDropEvent = (ev: SyntheticDragEvent<HTMLSpanElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    let file: ?File = this.getFileFromDragEvent(ev);
    if (file) {
      this.props.onChange(file);
    }
  }

  render = () => {
    const { children, className, onClick, onChange, ...other } = this.props // eslint-disable-line no-unused-vars
    return (
      <span onClick={this.handleClick} className={classNames(style.container, className)} ondrop={this.handleDropEvent} ondragover={this.handleDragOverEvent}>
        { children }
        <input
          type="file"
          className={style.input}
          ref={ ref => this.input = ref }
          onChange={this.handleChange}
          {...other}
        />
      </span>
    )
  }
}
