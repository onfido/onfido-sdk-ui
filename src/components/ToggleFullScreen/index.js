// @flow
import * as React from 'react'
import { h, Component } from 'preact'

type Props = {
  useFullScreen: boolean => void,
}

export default class FullScreenToggle extends Component<Props> {
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