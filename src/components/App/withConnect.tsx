import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { actions } from '../ReduxAppWrapper/store/actions/'
import type { RootState } from '../ReduxAppWrapper/store/reducers'
import type { CaptureActions, GlobalActions } from '../ReduxAppWrapper/types'

const mapStateToProps = (state: RootState) => ({
  ...state.globals,
  captures: state.captures,
})

const mapDispatchToProps = (
  dispatch: Dispatch<CaptureActions | GlobalActions>
) => ({
  actions: bindActionCreators(actions, dispatch),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector
