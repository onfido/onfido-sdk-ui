import { h, ComponentType, FunctionComponent } from 'preact'
import { useEffect } from 'preact/compat'
import { useDispatch, useSelector } from 'react-redux'
import { setFullScreen } from '../ReduxAppWrapper/store/actions/globals'

import type { Dispatch } from 'redux'
import type { CombinedActions, GlobalActions, RootState } from '~types/redux'

export type WithFullScreenStateProps = {
  isFullScreen?: boolean
}

// @TODO: deprecate this props to consume `useSelector` and `useDispatch` hooks instead
export function withFullScreenState<P>(
  WrappedComponent: ComponentType<WithFullScreenStateProps & P>
): ComponentType<P> {
  const WithFullScreenComponent: FunctionComponent<P> = (props) => {
    const isFullScreen = useSelector<RootState, boolean | undefined>(
      (state) => state.globals.isFullScreen
    )

    return <WrappedComponent {...props} isFullScreen={isFullScreen} />
  }

  return WithFullScreenComponent
}

export type WithFullScreenActionProps = {
  setFullScreen: (value: boolean) => void
}

// @TODO: deprecate this props to consume `useSelector` and `useDispatch` hooks instead
export function withFullScreenAction<P>(
  WrappedComponent: ComponentType<WithFullScreenActionProps & P>
): ComponentType<P> {
  const WithFullScreenComponent: FunctionComponent<P> = (props) => {
    const dispatch = useDispatch<Dispatch<GlobalActions>>()
    const setFullScreenAction = (value: boolean): void => {
      dispatch(setFullScreen(value))
    }

    return <WrappedComponent {...props} setFullScreen={setFullScreenAction} />
  }

  return WithFullScreenComponent
}

export const ToggleFullScreen: FunctionComponent = () => {
  const dispatch = useDispatch<Dispatch<CombinedActions>>()

  useEffect(() => {
    dispatch(setFullScreen(true))

    return () => dispatch(setFullScreen(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
