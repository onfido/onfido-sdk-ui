import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import '../../utils/__mocks__/objectUrl' // eslint-disable-line jest/no-mocks-import
import CaptureImageViewer from '../CaptureImageViewer'

const fakeBlob = new Blob([])
const fakeFileBlob = new File([], 'fake-file.jpg')

describe('CaptureViewer', () => {
  describe('CaptureImageViewer', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<CaptureImageViewer blob={fakeBlob} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders items correctly', () => {
        const wrapper = mount(<CaptureImageViewer blob={fakeBlob} />)
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('.imageWrapper').exists()).toBeTruthy()

        const image = wrapper.find('img')
        expect(image.exists()).toBeTruthy()
        expect(image.hasClass('image')).toBeTruthy()
        expect(image.prop('src')).toEqual('fake-object-url')
      })
    })

    describe('with File blob', () => {
      it('renders items correctly', () => {
        const wrapper = mount(<CaptureImageViewer blob={fakeFileBlob} />)
        expect(wrapper.exists()).toBeTruthy()

        const image = wrapper.find('img')
        expect(image.exists()).toBeTruthy()
        expect(image.hasClass('image')).toBeTruthy()
        expect(image.prop('src')).toEqual('data:image/jpeg;base64,00')
      })
    })
  })
})
