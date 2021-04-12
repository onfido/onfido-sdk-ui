import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import CaptureControls from '../index'

jest.mock('../../../VideoCapture')

describe('DocumentMultiFrame', () => {
  describe('CaptureControls', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedLocalised>
          <MockedVideoCapture
            renderVideoOverlay={(props) => <CaptureControls {...props} />}
          />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
