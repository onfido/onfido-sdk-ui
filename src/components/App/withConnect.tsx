import { h, ComponentType, FunctionComponent } from 'preact'
import { bindActionCreators, Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../ReduxAppWrapper/store/actions/'

import type {
  CombinedActions,
  RootState,
  GlobalState,
  CaptureState,
} from '~types/redux'
import type { ReduxProps } from '~types/routers'

export default function withConnect<P>(
  WrappedComponent: ComponentType<ReduxProps & P>
): ComponentType<P> {
  const ConnectedModalApp: FunctionComponent<P> = (props) => {
    const globals = useSelector<RootState, GlobalState>(
      (state) => state.globals
    )
    const captures = useSelector<RootState, CaptureState>(
      (state) => state.captures
    )
    const dispatch = useDispatch<Dispatch<CombinedActions>>()

    const reduxProps: ReduxProps = {
      ...globals,
      captures,
      actions: bindActionCreators(actions, dispatch),
    }

    return <WrappedComponent {...props} {...reduxProps} />
  }

  return ConnectedModalApp
}
