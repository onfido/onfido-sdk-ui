import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/compat'
import { connect, useDispatch } from 'react-redux'
import { setFullScreen } from '../ReduxAppWrapper/store/actions/globals'

import type { Dispatch } from 'redux'
import type { CombinedActions, RootState } from '~types/redux'

export const withFullScreenState = connect(
  ({ globals: { isFullScreen } }: RootState) => ({
    isFullScreen,
  })
)

export const withFullScreenAction = connect(null, (dispatch) => ({
  setFullScreen: (value: boolean) => dispatch(setFullScreen(value)),
}))

export const ToggleFullScreen: FunctionComponent = () => {
  const dispatch = useDispatch<Dispatch<CombinedActions>>()

  useEffect(() => {
    dispatch(setFullScreen(true))

    return () => dispatch(setFullScreen(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
