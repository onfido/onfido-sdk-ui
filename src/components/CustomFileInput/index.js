// import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.scss'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'

/* type Props = {
  children: ?React.Node,
  className: ?string,
  onClick: (?void) => void,
  onChange: (File) => void,
} */

const noop = () => {}

class CustomFileInput extends Component {
  static defaultProps = {
    children: null,
    className: '',
    onClick: noop,
    onChange: noop,
  }

  input

  handleClick = () => {
    console.log('handleClick', this.input.dispatchEvent(new Event('click')))
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

  hasPermission = false

  askPermission = (e) => {
    console.log('beforeClick', this.hasPermission, navigator.mediaDevices)
    if(this.hasPermission){ 
      this.handleClick()
      return
    }
    // navigator.mediaDevices.enumerateDevices().then(devices => {
    //       const labels = []
    //       devices.forEach(device => {
    //         labels.push(device.label)
    //       })
      
    //       alert(labels.join(', '))
    //     })
    // e.preventDefault()
    // alert('gainPermissions')
    // this.handleClick()
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        console.log('gained permission')
        this.hasPermission = true
        // alert('access')
        setTimeout(() => {
          this.handleClick()
        }, 1000)
        // this.input.click()
      })
      .catch((e) => {
        console.log('error permissons')
        alert(e.message)
      })
  }

  onInputClick = (e) => {
    console.log('onInputClick', this.hasPermission)
    if (!this.hasPermission) {
      e.preventDefault()

      this.askPermission()
      return
    }
    
    
  }

  render = () => {
    const { children, className, onClick, onChange, ...other } = this.props // eslint-disable-line no-unused-vars
    return (
      <span
        onClick={this.askPermission}
        className={classNames(style.container, className)}
      >
        {children}
        <input
          type="file"
          className={style.input}
          ref={(ref) => (this.input = ref)}
          onChange={this.handleChange}
          // onClick={this.askPermission}
          {...other}
        />
      </span>
    )
  }
}

export default CustomFileInput
