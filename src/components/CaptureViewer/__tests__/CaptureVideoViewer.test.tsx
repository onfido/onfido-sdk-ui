import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import CaptureVideoViewer from '../CaptureVideoViewer'

jest.mock('~utils/objectUrl')

const defaultProps = {
  ariaLabel: 'Fake aria-label',
  blob: new Blob([]),
  onVideoError: jest.fn(),
  trackScreen: jest.fn(),
}

describe('CaptureViewer', () => {
  describe('CaptureVideoViewer', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<CaptureVideoViewer {...defaultProps} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders items correctly', () => {
        const wrapper = mount(<CaptureVideoViewer {...defaultProps} />)
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('.videoWrapper').exists()).toBeTruthy()

        const video = wrapper.find('video')
        expect(video.exists()).toBeTruthy()
        expect(video.hasClass('video')).toBeTruthy()
        expect(video.prop('aria-label')).toEqual(defaultProps.ariaLabel)
      })
    })
  })
})
