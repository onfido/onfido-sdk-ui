import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import FaceOverlay from '../FaceOverlay'

describe('Overlay', () => {
  describe('FaceOverlay', () => {
    it('renders items correctly by default', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <FaceOverlay />
          </MockedLocalised>
        </MockedReduxProvider>
      )
      const container = wrapper.find('FaceOverlay div')
      expect(container.hasClass('faceOverlay')).toBeTruthy()
      expect(container.hasClass('isWithoutHole')).toBeFalsy()
      expect(container.find('.face').exists()).toBeTruthy()
      expect(container.find('.ariaLabel').text()).toEqual(
        'selfie_capture.frame_accessibility'
      )
    })

    it('renders items correctly without hole', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <FaceOverlay isWithoutHole />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      const container = wrapper.find('FaceOverlay div')
      expect(container.hasClass('isWithoutHole')).toBeTruthy()
    })

    it('renders video aria label', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <FaceOverlay video />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      const container = wrapper.find('FaceOverlay div')
      expect(container.find('.ariaLabel').text()).toEqual(
        'video_capture.frame_accessibility'
      )
    })

    it('renders custom aria label', () => {
      const ariaLabel = 'Custom aria label'

      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <FaceOverlay ariaLabel={ariaLabel} />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      const container = wrapper.find('FaceOverlay div')
      expect(container.find('.ariaLabel').text()).toEqual(ariaLabel)
    })
  })
})
