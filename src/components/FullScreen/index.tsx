import { h, Component, ComponentType } from 'preact'
import { connect } from 'react-redux'
import { setFullScreen } from '../ReduxAppWrapper/store/actions/globals'
import type { RootState } from '../ReduxAppWrapper/store/reducers'

type WithFullScreenActionProps = {
  setFullScreen: (value: boolean) => void
}

class ToggleOnMount extends Component<WithFullScreenActionProps> {
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

export const withFullScreenAction = connect(null, (dispatch) => ({
  setFullScreen: (value: boolean) => dispatch(setFullScreen(value)),
}))

export const ToggleFullScreen = withFullScreenAction<
  ComponentType<WithFullScreenActionProps>
>(ToggleOnMount)
