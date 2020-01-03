// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { connect } from 'react-redux'
import { setFullScreen } from '../ReduxAppWrapper/store/actions/globals'

type Props = {
  setFullScreen: boolean => void,
}

class ToggleOnMount extends Component<Props> {
  componentDidMount() {
    this.props.setFullScreen(true)
  }

  componentWillUnmount() {
    this.props.setFullScreen(false)
  }

  render() {
    return null
  }
}

export const withFullScreenState = connect(({ globals: { isFullScreen }}) => ({ isFullScreen }))

export const withFullScreenAction = connect(null, dispatch => ({
  setFullScreen: value => dispatch(setFullScreen(value))
}))

export const ToggleFullScreen = withFullScreenAction(ToggleOnMount)