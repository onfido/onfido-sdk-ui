// @flow
import * as React from 'react'
import { h, Component } from 'preact'

export default class FullScreenToggle extends Component {
  componentDidMount() {
    this.props.useFullScreen(true)
  }

  componentWillUnmount() {
    this.props.useFullScreen(false)
  }

  render() {
    return null
  }
}