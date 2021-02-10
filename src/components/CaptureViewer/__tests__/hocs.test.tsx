import { h, FunctionComponent } from 'preact'
import { mount } from 'enzyme'

import '../../utils/__mocks__/objectUrl'
import { withBlobPreviewUrl, withBlobBase64 } from '../hocs'

type DummyProps = {
  base64?: string
  previewUrl?: string
}

const DummyComponent: FunctionComponent<DummyProps> = ({
  base64,
  previewUrl,
}) => (
  <div>
    {base64 && <span class="base64">{base64}</span>}
    {previewUrl && <span class="previewUrl">{previewUrl}</span>}
  </div>
)

const MockedPreviewUrl = withBlobPreviewUrl(DummyComponent)
const MockedBase64 = withBlobBase64(DummyComponent)

const fakeBlob = new Blob([])

describe('CaptureViewer', () => {
  describe('withBlobPreviewUrl', () => {
    it('renders without crashing', () => {
      const wrapper = mount(<MockedPreviewUrl blob={fakeBlob} />)
      expect(wrapper.find('.previewUrl').exists()).toBeTruthy()
      expect(wrapper.find('.previewUrl').text()).toEqual('fake-object-url')
      expect(wrapper.find('.base64').exists()).toBeFalsy()
    })
  })

  describe.skip('withBlobBase64', () => {
    it('renders without crashing', () => {
      const wrapper = mount(<MockedBase64 blob={fakeBlob} />)
      expect(wrapper.find('.base64').text()).toEqual('fake-object-url')
      expect(wrapper.find('.base64').exists()).toBeTruthy()
      expect(wrapper.find('.previewUrl').exists()).toBeFalsy()
    })
  })
})
