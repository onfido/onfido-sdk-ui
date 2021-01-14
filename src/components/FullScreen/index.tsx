import { h, Component, ComponentType } from 'preact'
import type { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { setFullScreen } from '../ReduxAppWrapper/store/actions/globals'
import type { RootState } from '../ReduxAppWrapper/store/reducers'
import type { CaptureActions, GlobalActions } from '../ReduxAppWrapper/types'

type Props = {
  setFullScreen: (isFullScreen: boolean) => void
}

class ToggleOnMount extends Component<Props> {
  componentDidMount() {
    this.props.setFullScreen(true)
  }

  componentWillUnmount() {
    this.props.setFullScreen(false)
  }

  render(): h.JSX.Element {
    return null
  }
}

export const withFullScreenState = connect(
  ({ globals: { isFullScreen } }: RootState) => ({
    isFullScreen,
  })
)

export const withFullScreenAction = connect(
  null,
  (dispatch: Dispatch<CaptureActions | GlobalActions>) => ({
    setFullScreen: (value: boolean) => dispatch(setFullScreen(value)),
  })
)

export const ToggleFullScreen = withFullScreenAction<ComponentType<Props>>(
  ToggleOnMount
)
