import { h, Component, ComponentChildren, ComponentChild } from 'preact'
import classNames from 'classnames'
import style from './style.scss'

type CustomFileInputProps = {
  children: ComponentChildren
  className: string
  accept?: string
  capture?: boolean | string
  onClick: () => void
  onChange: (file: File) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export default class CustomFileInput extends Component<CustomFileInputProps> {
  static defaultProps = {
    children: null,
    className: '',
    onClick: noop,
    onChange: noop,
  }

  input: HTMLInputElement | null = null

  private handleClick = () => {
    if (this.input) {
      this.input.click()
    }
    this.props.onClick()
  }

  private handleChange = (event: Event) => {
    if (this.input && this.input.files) {
      this.props.onChange(this.input.files[0])
    }

    if (event.currentTarget) {
      const inputTarget = event.currentTarget as HTMLInputElement
      inputTarget.value = '' // Allow re-uploading the same file
    }
  }

  render = (): ComponentChild => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, className, onClick, onChange, ...other } = this.props
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
