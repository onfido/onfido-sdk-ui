import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { actions } from '../ReduxAppWrapper/store/actions/'
import type { RootState } from '../ReduxAppWrapper/store/reducers'
import type { CaptureActions, GlobalActions } from '../ReduxAppWrapper/types'

type CombinedActions = CaptureActions | GlobalActions

const mapStateToProps = (state: RootState) => ({
  ...state.globals,
  captures: state.captures,
})

const mapDispatchToProps = (dispatch: Dispatch<CombinedActions>) => ({
  actions: bindActionCreators(actions, dispatch),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type ReduxProps = ConnectedProps<typeof connector>

export default connector
