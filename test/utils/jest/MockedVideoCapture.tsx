import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'

import type { VideoOverlayProps } from 'components/VideoCapture'

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

export default MockedVideoCapture
