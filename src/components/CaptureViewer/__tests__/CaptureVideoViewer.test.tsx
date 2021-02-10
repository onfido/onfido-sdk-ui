import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import '../../utils/__mocks__/objectUrl' // eslint-disable-line jest/no-mocks-import
import CaptureVideoViewer from '../CaptureVideoViewer'

const defaultProps = {
  ariaLabel: 'Fake aria-label',
  blob: new Blob([]),
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
