import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import { DefaultContent, DocVideoContent } from '../Content'

describe('Welcome', () => {
  describe('DefaultContent', () => {
    it('renders correct elements', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DefaultContent />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()

      const descriptions = wrapper.find('.text p')
      expect(descriptions.at(0).text()).toMatch('welcome.description_p_1')
      expect(descriptions.at(1).text()).toMatch('welcome.description_p_2')
    })

    it('renders correct elements with custom descriptions', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DefaultContent
            descriptions={[
              'Fake description 1',
              'Fake description 2',
              'Fake description 3',
            ]}
          />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()

      const descriptions = wrapper.find('.text p')
      expect(descriptions.at(0).text()).toMatch('Fake description 1')
      expect(descriptions.at(1).text()).toMatch('Fake description 2')
      expect(descriptions.at(2).text()).toMatch('Fake description 3')
    })
  })

  describe('DocVideoContent', () => {
    it('renders correct elements', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DocVideoContent />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()

      expect(wrapper.find('.subtitle').text()).toEqual(
        'doc_video_capture.welcome.subtitle'
      )
      expect(wrapper.find('.caption').text()).toEqual(
        'doc_video_capture.welcome.caption'
      )
      const items = wrapper.find('.instructions > li')
      expect(items.at(0).text()).toEqual(
        'doc_video_capture.welcome.instruction_item_1'
      )
      expect(items.at(1).text()).toEqual(
        'doc_video_capture.welcome.instruction_item_2'
      )
      expect(wrapper.find('.recordingLimit').text()).toEqual(
        'doc_video_capture.welcome.limit'
      )
    })
  })
})
