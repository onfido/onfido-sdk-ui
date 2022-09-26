import { useReducer } from 'preact/compat'

export type MachineSpec<S extends string, A extends string> = {
  initialState: S
  states: Partial<Record<S, Partial<Record<A, S>>>>
}

export const buildReducer = <S extends string, A extends string>(
  spec: MachineSpec<S, A>
) => (currentState: S, action: A): S => {
  const stateTransitions = spec.states[currentState]

  if (stateTransitions) {
    const nextState = stateTransitions[action]

    if (nextState) {
      // @TODO find out why TS doesn't recognise undefined check here
      // tsc complains: Type 'S | undefined' is not assignable to type 'S'
      return nextState as S
    }

    return currentState
  }

  return spec.initialState
}

const useStateMachine = <S extends string, A extends string>(
  spec: MachineSpec<S, A>
): [S, (action: A) => void] => {
  const reducer = buildReducer(spec)
  return useReducer(reducer, spec.initialState)
}

export default useStateMachine
