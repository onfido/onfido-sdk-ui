import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import CaptureControls from '../index'

import type { VideoOverlayProps } from '../../../VideoCapture'

type Props = {
  renderVideoOverlay: (props: VideoOverlayProps) => h.JSX.Element
  disableInteraction?: boolean
}

const MockedVideoCapture: FunctionComponent<Props> = ({
  renderVideoOverlay,
  disableInteraction = false,
}) => {
  const [isRecording, setIsRecording] = useState(false)

  return renderVideoOverlay({
    disableInteraction,
    isRecording,
    onStart: () => setIsRecording(true),
    onStop: () => setIsRecording(false),
  })
}

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

      console.log(wrapper.debug())
    })
  })
})
