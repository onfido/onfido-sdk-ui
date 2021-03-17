import { h, FunctionComponent } from 'preact'
import { mount, ReactWrapper } from 'enzyme'
import loadImage from 'blueimp-load-image'

import { revokeObjectURL } from '~utils/objectUrl'
import { withBlobPreviewUrl, withBlobBase64 } from '../hocs'

jest.mock('~utils/objectUrl')

type DummyProps = {
  base64?: string
  previewUrl?: string
}

const DummyComponent: FunctionComponent<DummyProps> = ({
  base64,
  previewUrl,
}) => (
  <div>
    {base64 && <span className="base64">{base64}</span>}
    {previewUrl && <span className="previewUrl">{previewUrl}</span>}
  </div>
)

const mockedLoadImage = loadImage as jest.MockedFunction<typeof loadImage>
const mockedRevokeObjectURL = revokeObjectURL as jest.MockedFunction<
  typeof revokeObjectURL
>
const MockedPreviewUrl = withBlobPreviewUrl(DummyComponent)
const MockedBase64 = withBlobBase64(DummyComponent)

const fakeBlob = new Blob([])

describe('CaptureViewer', () => {
  let wrapper: ReactWrapper
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('withBlobPreviewUrl', () => {
    beforeEach(() => {
      wrapper = mount(<MockedPreviewUrl blob={fakeBlob} />)
    })

    it('renders without crashing', () => {
      expect(wrapper.find('.previewUrl').exists()).toBeTruthy()
      expect(wrapper.find('.previewUrl').text()).toEqual('fake-object-url')
      expect(wrapper.find('.base64').exists()).toBeFalsy()
    })

    it('handles props changed properly', () => {
      wrapper.setProps({ blob: new Blob([]) })
      expect(mockedRevokeObjectURL).toHaveBeenCalled()
    })

    it('unmounts properly', () => {
      wrapper.unmount()
      expect(mockedRevokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('withBlobBase64', () => {
    beforeEach(() => {
      wrapper = mount(<MockedBase64 blob={fakeBlob} />)
    })

    it('renders without crashing', () => {
      expect(wrapper.find('.base64').exists()).toBeTruthy()
      expect(wrapper.find('.base64').text()).toEqual(
        'data:image/jpeg;base64,00'
      )
      expect(wrapper.find('.previewUrl').exists()).toBeFalsy()
    })

    it('handles props changed properly', () => {
      wrapper.setProps({ blob: new Blob([]) })
      expect(mockedLoadImage).toHaveBeenCalled()
    })
  })
})
