import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import useStateMachine, { MachineSpec } from '../useStateMachine'

type LightStates = 'green' | 'yellow' | 'red' | 'off'
type LightActions = 'TIMED_OUT' | 'ERROR' | 'POWER_OUTAGE'

const testSpec: MachineSpec<LightStates, LightActions> = {
  initialState: 'green',
  states: {
    green: {
      TIMED_OUT: 'yellow',
      ERROR: 'red',
      POWER_OUTAGE: 'off',
    },
    yellow: {
      TIMED_OUT: 'red',
      ERROR: 'red',
      POWER_OUTAGE: 'off',
    },
    red: {
      TIMED_OUT: 'green',
      POWER_OUTAGE: 'off',
    },
  },
}

type DummyProps = {
  initialState: LightStates
}

const DummyComponent: FunctionComponent<DummyProps> = ({ initialState }) => {
  const [light, dispatchAction] = useStateMachine({ ...testSpec, initialState })

  return (
    <div>
      <span id="light">{light}</span>
      <button id="switchLight" onClick={() => dispatchAction('TIMED_OUT')}>
        Switch light
      </button>
      <button id="error" onClick={() => dispatchAction('ERROR')}>
        Trigger error
      </button>
    </div>
  )
}

const simulateSwitchLight = (wrapper: ShallowWrapper, times: number) => {
  const switchLight = wrapper.find('#switchLight')
  Array(times)
    .fill(null)
    .forEach(() => switchLight.simulate('click'))
}

const assertLightState = (wrapper: ShallowWrapper, light: LightStates) => {
  expect(wrapper.find('#light').text()).toEqual(light)
}

describe('utils', () => {
  describe('useStateMachine', () => {
    let wrapper: ShallowWrapper

    beforeEach(() => {
      wrapper = shallow(<DummyComponent initialState="green" />)
    })

    it('returns correct state initially', () =>
      assertLightState(wrapper, 'green'))

    it('returns correct state when switch light 1 times', () => {
      simulateSwitchLight(wrapper, 1)
      assertLightState(wrapper, 'yellow')
    })

    it('returns correct state when switch light 2 times', () => {
      simulateSwitchLight(wrapper, 2)
      assertLightState(wrapper, 'red')
    })

    it('returns correct state when error', () => {
      wrapper.find('#error').simulate('click')
      assertLightState(wrapper, 'red')
    })

    it('returns correct state when error after switch light', () => {
      simulateSwitchLight(wrapper, 1) // should be yellow
      wrapper.find('#error').simulate('click')
      assertLightState(wrapper, 'red')
    })

    it('does nothing when error on red light', () => {
      simulateSwitchLight(wrapper, 2) // should be red
      wrapper.find('#error').simulate('click')
      assertLightState(wrapper, 'red')
    })

    describe('with initialState=error', () => {
      beforeEach(() => {
        wrapper = shallow(<DummyComponent initialState="off" />)
      })

      it('remains error in any cases', () => {
        assertLightState(wrapper, 'off')

        simulateSwitchLight(wrapper, 1)
        assertLightState(wrapper, 'off')

        simulateSwitchLight(wrapper, 2)
        assertLightState(wrapper, 'off')
      })
    })
  })
})
