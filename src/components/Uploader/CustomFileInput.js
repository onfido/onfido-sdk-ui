// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'

type Props = {
  children: ?React.ReactNode,
  className: ?string,
  onClick: ?void => void,
  onFileSelected: File => void,
}

export default class CustomFileInput extends React.Component<Props> {
  static defaultProps: Props = {
    onFileSelected: () => {},
  }
  
  input:HTMLInputElement

  handleUpload = event => {
    if (this.input) {
      this.props.onFileSelected(this.input.files[0])
    }
    // Allow upload of the same file if needed
    event.target.value = null
  }

  handleClick = () => {
    if (this.input) {
      this.input.click()
    }
  } 

  render = () => {
    const { children, className, onClick, onFileSelected } = this.props
    return (
      <span onClick={this.handleClick} className={className}>
        { children }
        <input
          type="file"
          ref={ ref => this.input = ref } style={{ display: 'none' }}
          onChange={this.handleUpload}
        />
      </span>
    )
  }
}
